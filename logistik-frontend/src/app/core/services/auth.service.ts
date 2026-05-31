import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { AuthResponse, CurrentUser, LoginRequest, RefreshTokenRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  private _currentUser = signal<CurrentUser | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'Admin');

  constructor() {
    this.loadUserFromToken();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap(response => {
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
        if (response.user) {
          this._currentUser.set(response.user);
        }
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken } as RefreshTokenRequest).pipe(
      tap(response => {
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
        if (response.user) {
          this._currentUser.set(response.user);
        }
      })
    );
  }

  logout(): void {
    const refreshToken = this.tokenService.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${environment.apiUrl}/auth/revoke`, { refreshToken }).subscribe();
    }
    this.tokenService.clearTokens();
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getCurrentUserFromApi(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${environment.apiUrl}/auth/me`).pipe(
      tap(user => this._currentUser.set(user))
    );
  }

  hasCompanyAccess(companyId: number): boolean {
    const user = this._currentUser();
    if (!user) return false;
    if (user.role === 'Admin') return true;
    return user.assignedCompanyIds.includes(companyId);
  }

  canEditCompany(companyId: number): boolean {
    const user = this._currentUser();
    if (!user) return false;
    if (user.role === 'Admin') return true;
    return user.permissions.some(p => p.companyId === companyId && p.canEdit);
  }

  canExportCompany(companyId: number): boolean {
    const user = this._currentUser();
    if (!user) return false;
    if (user.role === 'Admin') return true;
    return user.permissions.some(p => p.companyId === companyId && p.canExport);
  }

  private loadUserFromToken(): void {
    const token = this.tokenService.getAccessToken();
    if (!token || !this.tokenService.isAccessTokenValid()) return;
    const payload = this.tokenService.decodeToken(token);
    if (!payload) return;

    // Role may appear as 'role' or under the full .NET claim URI
    const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const role = (payload['role'] ?? payload[roleKey]) as string;

    this._currentUser.set({
      id: Number(payload['sub']),
      username: payload['username'] as string ?? payload['email'] as string ?? '',
      email: payload['email'] as string ?? '',
      firstName: payload['firstName'] as string ?? '',
      lastName: payload['lastName'] as string ?? '',
      role,
      assignedCompanyIds: (payload['companies'] as string ?? '').split(',').filter(Boolean).map(Number),
      permissions: []
    });
  }
}
