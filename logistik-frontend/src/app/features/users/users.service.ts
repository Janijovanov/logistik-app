import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, CreateUserRequest, UpdateUserRequest, AssignPermissionRequest } from '../../core/models/user.models';
import { PaginatedResult } from '../../core/models/pagination.models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/users`;

  getAll(page = 1, pageSize = 20, search = '', isActive?: boolean): Observable<PaginatedResult<User>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize).set('search', search);
    if (isActive !== undefined) params = params.set('isActive', isActive);
    return this.http.get<PaginatedResult<User>>(this.base, { params });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`);
  }

  create(request: CreateUserRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.base, request);
  }

  update(id: number, request: UpdateUserRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  activate(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/activate`, {});
  }

  assignPermission(userId: number, request: AssignPermissionRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/${userId}/permissions`, request);
  }

  updatePermission(userId: number, companyId: number, request: Omit<AssignPermissionRequest, 'companyId'>): Observable<void> {
    return this.http.put<void>(`${this.base}/${userId}/permissions/${companyId}`, request);
  }

  revokePermission(userId: number, companyId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${userId}/permissions/${companyId}`);
  }
}
