import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../core/services/notification.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmNewPassword')?.value;
  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatProgressSpinnerModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ 'auth.changePassword' | translate }}</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="form-container">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'auth.currentPassword' | translate }}</mat-label>
          <input matInput type="password" formControlName="currentPassword" autocomplete="current-password" />
          <mat-icon matSuffix>lock</mat-icon>
          @if (form.get('currentPassword')?.hasError('required') && form.get('currentPassword')?.touched) {
            <mat-error>{{ 'errors.required' | translate }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'auth.newPassword' | translate }}</mat-label>
          <input matInput type="password" formControlName="newPassword" autocomplete="new-password" />
          <mat-icon matSuffix>lock_outline</mat-icon>
          @if (form.get('newPassword')?.hasError('required') && form.get('newPassword')?.touched) {
            <mat-error>{{ 'errors.required' | translate }}</mat-error>
          }
          @if (form.get('newPassword')?.hasError('minlength') && form.get('newPassword')?.touched) {
            <mat-error>Min 6 characters</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'auth.confirmNewPassword' | translate }}</mat-label>
          <input matInput type="password" formControlName="confirmNewPassword" autocomplete="new-password" />
          <mat-icon matSuffix>lock_outline</mat-icon>
          @if (form.get('confirmNewPassword')?.hasError('required') && form.get('confirmNewPassword')?.touched) {
            <mat-error>{{ 'errors.required' | translate }}</mat-error>
          }
        </mat-form-field>

        @if (form.hasError('passwordMismatch') && form.get('confirmNewPassword')?.touched) {
          <div class="error-msg">{{ 'auth.passwordMismatch' | translate }}</div>
        }
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="dialogRef.close()">{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="submit()" [disabled]="saving || form.invalid">
        @if (saving) {
          <mat-spinner diameter="18" style="display:inline-block;margin-right:8px;" />
        }
        {{ 'auth.changePassword' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 4px; min-width: 340px; padding-top: 8px; }
    .full-width { width: 100%; }
    .error-msg { color: #d32f2f; font-size: 12px; margin-top: -8px; margin-bottom: 8px; }
  `]
})
export class ChangePasswordDialogComponent {
  dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);
  private http = inject(HttpClient);
  private notifications = inject(NotificationService);
  private translate = inject(TranslateService);
  private fb = inject(FormBuilder);

  saving = false;

  form = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmNewPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const { currentPassword, newPassword } = this.form.value;
    this.http.post<void>(`${environment.apiUrl}/auth/change-password`, { currentPassword, newPassword }).subscribe({
      next: () => {
        this.saving = false;
        this.notifications.success(this.translate.instant('auth.passwordChanged'));
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        this.saving = false;
        const msg = err.error?.[0] ?? err.error?.message ?? 'Failed to change password.';
        this.notifications.error(msg);
      }
    });
  }
}
