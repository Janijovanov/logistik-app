import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  template: `
    <div class="login-wrapper">
      <div class="lang-switcher">
        <button mat-button class="lang-btn" [class.lang-active]="currentLang() === 'mk'" (click)="setLang('mk')">MK</button>
        <button mat-button class="lang-btn" [class.lang-active]="currentLang() === 'en'" (click)="setLang('en')">EN</button>
      </div>
      <mat-card class="login-card">
        <mat-card-header>
          <div class="login-logo">
            <img src="assets/logistik_white_background.png" alt="Logistik" />
            <h1>Logistik</h1>
            <p class="text-muted">{{ 'auth.subtitle' | translate }}</p>
          </div>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'auth.username' | translate }}</mat-label>
              <input matInput formControlName="username" autocomplete="username" />
              <mat-icon matSuffix>person</mat-icon>
              @if (form.get('username')?.hasError('required') && form.get('username')?.touched) {
                <mat-error>{{ 'auth.usernameRequired' | translate }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'auth.password' | translate }}</mat-label>
              <input
                matInput
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                autocomplete="current-password"
              />
              <button mat-icon-button matSuffix type="button" (click)="showPassword = !showPassword">
                <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
                <mat-error>{{ 'auth.passwordRequired' | translate }}</mat-error>
              }
            </mat-form-field>

            @if (errorMessage) {
              <div class="error-banner">
                <mat-icon>error_outline</mat-icon>
                {{ errorMessage }}
              </div>
            }

            <button
              mat-flat-button
              color="primary"
              type="submit"
              class="full-width login-btn"
              [disabled]="loading"
            >
              @if (loading) {
                <mat-spinner diameter="20" />
              } @else {
                {{ 'auth.signIn' | translate }}
              }
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #3949ab 0%, #26a69a 100%);
      padding: 24px;
      position: relative;
    }
    .lang-switcher {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      gap: 2px;
    }
    .lang-btn {
      min-width: 40px;
      padding: 0 10px;
      font-size: 12px;
      font-weight: 700;
      color: rgba(255,255,255,0.6);
      border-radius: 6px;
    }
    .lang-active {
      color: #fff;
      background: rgba(255,255,255,0.2);
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      border-radius: 16px !important;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2) !important;
    }
    .login-logo {
      text-align: center;
      padding: 24px 0 8px;
      width: 100%;

      img {
        width: 72px;
        height: 72px;
        object-fit: contain;
        border-radius: 12px;
        margin-bottom: 12px;
      }
      h1 {
        font-size: 28px;
        font-weight: 700;
        color: #3949ab;
        margin: 0;
      }
      p { margin: 4px 0 0; }
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px 0;
    }
    .login-btn {
      margin-top: 8px;
      height: 44px;
      font-size: 15px;
    }
    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: #ffebee;
      color: #c62828;
      border-radius: 8px;
      font-size: 13px;

      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }
    mat-spinner { margin: auto; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notifications = inject(NotificationService);
  private translate = inject(TranslateService);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading = false;
  showPassword = false;
  errorMessage = '';
  currentLang = signal(localStorage.getItem('lang') ?? 'mk');

  setLang(lang: string): void {
    this.currentLang.set(lang);
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.form.value as { username: string; password: string }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message ?? 'Invalid username or password.';
      }
    });
  }
}
