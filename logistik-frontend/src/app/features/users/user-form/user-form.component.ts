import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersService } from '../users.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSelectModule,
    MatSlideToggleModule, MatProgressSpinnerModule, PageHeaderComponent
  ],
  template: `
    <app-page-header [title]="isEdit ? 'Edit User' : 'New User'">
      <button mat-stroked-button routerLink="/users">
        <mat-icon>arrow_back</mat-icon>
        Back
      </button>
    </app-page-header>

    <mat-card class="form-card">
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" />
            </mat-form-field>
          </div>

          <div class="form-row">
            @if (!isEdit) {
              <mat-form-field appearance="outline">
                <mat-label>Username</mat-label>
                <input matInput formControlName="username" />
              </mat-form-field>
            }

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" />
            </mat-form-field>
          </div>

          @if (!isEdit) {
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput type="password" formControlName="password" />
              </mat-form-field>
            </div>
          }

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Role</mat-label>
              <mat-select formControlName="roleId">
                <mat-option [value]="1">Admin</mat-option>
                <mat-option [value]="2">User</mat-option>
              </mat-select>
            </mat-form-field>

            @if (isEdit) {
              <mat-slide-toggle formControlName="isActive" color="primary" class="mt-sm">Active</mat-slide-toggle>
            }
          </div>

          <div class="form-actions mt-lg">
            <button mat-stroked-button type="button" routerLink="/users">Cancel</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="saving()">
              @if (saving()) { <mat-spinner diameter="18" /> }
              {{ isEdit ? 'Save Changes' : 'Create User' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-card { max-width: 700px; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
    mat-spinner { margin-right: 8px; display: inline-block; }
  `]
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(UsersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notifications = inject(NotificationService);

  isEdit = false;
  userId: number | null = null;
  saving = signal(false);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [''],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    roleId: [2],
    isActive: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('userId');
    if (id) {
      this.isEdit = true;
      this.userId = +id;
      this.service.getById(this.userId).subscribe(u => {
        this.form.patchValue({
          ...u,
          roleId: u.role === 'Admin' ? 1 : 2
        });
      });
    } else {
      this.form.get('username')!.setValidators(Validators.required);
      this.form.get('password')!.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving.set(true);
    const v = this.form.value;

    const onSuccess = () => {
      this.notifications.success(this.isEdit ? 'User updated.' : 'User created.');
      this.router.navigate(['/users']);
    };
    const onError = (err: any) => {
      this.saving.set(false);
      this.notifications.error(err.error?.message ?? 'Failed to save user.');
    };

    if (this.isEdit) {
      this.service.update(this.userId!, { email: v.email!, firstName: v.firstName!, lastName: v.lastName!, roleId: v.roleId!, isActive: v.isActive! })
        .subscribe({ next: onSuccess, error: onError });
    } else {
      this.service.create({ username: v.username!, email: v.email!, firstName: v.firstName!, lastName: v.lastName!, password: v.password!, roleId: v.roleId! })
        .subscribe({ next: onSuccess, error: onError });
    }
  }
}
