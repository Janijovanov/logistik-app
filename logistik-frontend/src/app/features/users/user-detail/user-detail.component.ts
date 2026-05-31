import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UsersService } from '../users.service';
import { CompaniesService } from '../../companies/companies.service';
import { User, UserCompanyPermission } from '../../../core/models/user.models';
import { Company } from '../../../core/models/company.models';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatTableModule,
    MatCheckboxModule, MatSelectModule, MatFormFieldModule,
    MatProgressSpinnerModule, MatDialogModule, PageHeaderComponent
  ],
  template: `
    @if (loading()) {
      <div class="loading-wrap"><mat-spinner diameter="40" /></div>
    } @else if (loadError()) {
      <div class="loading-wrap">
        <mat-icon color="warn">error_outline</mat-icon>
        <p>{{ loadError() }}</p>
        <button mat-stroked-button routerLink="/users">Back to Users</button>
      </div>
    } @else if (user()) {
      <app-page-header [title]="user()!.firstName + ' ' + user()!.lastName" subtitle="User Permissions">
        <button mat-stroked-button routerLink="/users">
          <mat-icon>arrow_back</mat-icon>
          Back
        </button>
        <button mat-stroked-button [routerLink]="['/users', userId, 'edit']">
          <mat-icon>edit</mat-icon>
          Edit
        </button>
      </app-page-header>

      <div class="content-grid">
        <mat-card class="info-card">
          <mat-card-header><mat-card-title>User Info</mat-card-title></mat-card-header>
          <mat-card-content>
            <div class="info-row"><span>Username:</span><strong>{{ user()!.username }}</strong></div>
            <div class="info-row"><span>Email:</span><strong>{{ user()!.email }}</strong></div>
            <div class="info-row"><span>Role:</span><strong>{{ user()!.role }}</strong></div>
            <div class="info-row">
              <span>Status:</span>
              <span [class]="user()!.isActive ? 'chip-active' : 'chip-inactive'">
                {{ user()!.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="permissions-card">
          <mat-card-header>
            <mat-card-title>Company Permissions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="assign-form">
              <mat-form-field appearance="outline">
                <mat-label>Add Company</mat-label>
                <mat-select [formControl]="companySelectCtrl">
                  @for (c of availableCompanies(); track c.id) {
                    <mat-option [value]="c.id">{{ c.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <button mat-flat-button color="primary" (click)="assignCompany()" [disabled]="!companySelectCtrl.value">
                Assign
              </button>
            </div>

            <table mat-table [dataSource]="user()!.permissions ?? []" class="mat-elevation-z0">
              <ng-container matColumnDef="company">
                <th mat-header-cell *matHeaderCellDef>Company</th>
                <td mat-cell *matCellDef="let p">{{ p.companyName }}</td>
              </ng-container>
              <ng-container matColumnDef="canView">
                <th mat-header-cell *matHeaderCellDef>View</th>
                <td mat-cell *matCellDef="let p">
                  <mat-checkbox [checked]="p.canView" (change)="updatePerm(p, 'canView', $event.checked)" />
                </td>
              </ng-container>
              <ng-container matColumnDef="canEdit">
                <th mat-header-cell *matHeaderCellDef>Edit</th>
                <td mat-cell *matCellDef="let p">
                  <mat-checkbox [checked]="p.canEdit" (change)="updatePerm(p, 'canEdit', $event.checked)" />
                </td>
              </ng-container>
              <ng-container matColumnDef="canExport">
                <th mat-header-cell *matHeaderCellDef>Export</th>
                <td mat-cell *matCellDef="let p">
                  <mat-checkbox [checked]="p.canExport" (change)="updatePerm(p, 'canExport', $event.checked)" />
                </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let p">
                  <button mat-icon-button color="warn" (click)="revokeCompany(p)">
                    <mat-icon>remove_circle</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="permCols"></tr>
              <tr mat-row *matRowDef="let row; columns: permCols;"></tr>
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell empty-state" [attr.colspan]="permCols.length">No companies assigned</td>
              </tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
  styles: [`
    .content-grid { display: grid; grid-template-columns: 280px 1fr; gap: 16px; align-items: start; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .assign-form { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; mat-form-field { flex: 1; } }
    .chip-active { background: #e8f5e9; color: #2e7d32; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .chip-inactive { background: #f5f5f5; color: #757575; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .empty-state { text-align: center; padding: 24px; color: rgba(0,0,0,0.38); }
    .loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; gap: 16px; color: rgba(0,0,0,0.54); }
  `]
})
export class UserDetailComponent implements OnInit {
  private service = inject(UsersService);
  private companiesService = inject(CompaniesService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private notifications = inject(NotificationService);
  private fb = inject(FormBuilder);

  user = signal<User | null>(null);
  allCompanies = signal<Company[]>([]);
  availableCompanies = signal<Company[]>([]);
  loading = signal(true);
  loadError = signal<string | null>(null);
  userId!: number;
  permCols = ['company', 'canView', 'canEdit', 'canExport', 'actions'];
  companySelectCtrl = this.fb.control<number | null>(null);

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('userId')!;
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    this.loadError.set(null);
    forkJoin({
      user: this.service.getById(this.userId),
      companies: this.companiesService.getAll(1, 100)
    }).subscribe({
      next: ({ user, companies }) => {
        this.allCompanies.set(companies.items);
        this.user.set(user);
        this.updateAvailableCompanies(user);
        this.loading.set(false);
      },
      error: (err: any) => {
        const msg = err?.error?.message ?? err?.error?.title ?? (err?.status ? `HTTP ${err.status}` : 'Failed to load user data.');
        this.loadError.set(msg);
        this.loading.set(false);
        console.error('UserDetail load error:', err);
      }
    });
  }

  loadUser(): void {
    this.service.getById(this.userId).subscribe(u => {
      this.user.set(u);
      this.updateAvailableCompanies(u);
    });
  }

  updateAvailableCompanies(u: User): void {
    const assignedIds = (u.permissions ?? []).map(p => p.companyId);
    this.availableCompanies.set(this.allCompanies().filter(c => !assignedIds.includes(c.id)));
  }

  assignCompany(): void {
    const cId = this.companySelectCtrl.value;
    if (!cId) return;
    this.service.assignPermission(this.userId, { companyId: cId, canView: true, canEdit: false, canExport: false }).subscribe({
      next: () => { this.notifications.success('Company assigned.'); this.companySelectCtrl.reset(); this.loadAll(); },
      error: (err: any) => this.notifications.error(err.error?.message ?? 'Failed to assign company.')
    });
  }

  updatePerm(perm: UserCompanyPermission, field: keyof UserCompanyPermission, value: boolean): void {
    const updated = { ...perm, [field]: value };
    this.service.updatePermission(this.userId, perm.companyId, {
      canView: updated.canView,
      canEdit: updated.canEdit,
      canExport: updated.canExport
    }).subscribe({
      next: () => this.notifications.success('Permission updated.'),
      error: (err: any) => this.notifications.error(err.error?.message ?? 'Failed to update permission.')
    });
  }

  revokeCompany(perm: UserCompanyPermission): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Revoke Access',
        message: `Remove access to "${perm.companyName}"?`,
        confirmText: 'Revoke',
        warn: true
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.revokePermission(this.userId, perm.companyId).subscribe({
          next: () => { this.notifications.success('Access revoked.'); this.loadAll(); },
          error: (err: any) => this.notifications.error(err.error?.message ?? 'Failed to revoke access.')
        });
      }
    });
  }
}
