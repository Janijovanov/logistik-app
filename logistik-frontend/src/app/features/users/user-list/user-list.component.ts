import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UsersService } from '../users.service';
import { User } from '../../../core/models/user.models';
import { PaginatedResult } from '../../../core/models/pagination.models';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatPaginatorModule, MatTooltipModule,
    MatProgressSpinnerModule, MatDialogModule, PageHeaderComponent
  ],
  template: `
    <app-page-header title="Users" subtitle="Manage system users and permissions">
      <button mat-flat-button color="primary" routerLink="new">
        <mat-icon>person_add</mat-icon>
        Add User
      </button>
    </app-page-header>

    <div class="page-card">
      <div class="table-toolbar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search users</mat-label>
          <input matInput [formControl]="searchCtrl" />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      @if (loading()) {
        <div class="table-loading"><mat-spinner diameter="36" /></div>
      } @else {
        <table mat-table [dataSource]="result()?.items ?? []" class="mat-elevation-z0">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let u">
              <strong>{{ u.firstName }} {{ u.lastName }}</strong><br />
              <span class="text-muted text-sm">{{ u.username }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let u">{{ u.email }}</td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Role</th>
            <td mat-cell *matCellDef="let u">
              <span [class]="u.role === 'Admin' ? 'chip-admin' : 'chip-user'">{{ u.role }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="companies">
            <th mat-header-cell *matHeaderCellDef>Companies</th>
            <td mat-cell *matCellDef="let u">{{ u.permissions?.length ?? 0 }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let u">
              <span [class]="u.isActive ? 'chip-active' : 'chip-inactive'">
                {{ u.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let u" class="actions-cell">
              <button mat-icon-button [routerLink]="[u.id]" matTooltip="Manage permissions">
                <mat-icon>manage_accounts</mat-icon>
              </button>
              <button mat-icon-button [routerLink]="[u.id, 'edit']" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deactivate(u)" matTooltip="Deactivate">
                <mat-icon>person_off</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell empty-state" [attr.colspan]="columns.length">
              <mat-icon>people_outline</mat-icon>
              <p>No users found</p>
            </td>
          </tr>
        </table>

        <mat-paginator
          [length]="result()?.totalCount ?? 0"
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 20, 50]"
          (page)="onPage($event)"
        />
      }
    </div>
  `,
  styles: [`
    .table-toolbar { padding: 16px 16px 0; }
    .search-field { width: 320px; }
    .table-loading { display: flex; justify-content: center; padding: 48px; }
    .actions-cell { text-align: right; white-space: nowrap; }
    .chip-admin { background: #e8eaf6; color: #283593; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .chip-user { background: #e0f2f1; color: #00695c; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .chip-active { background: #e8f5e9; color: #2e7d32; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .chip-inactive { background: #f5f5f5; color: #757575; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .empty-state {
      text-align: center; padding: 48px; color: rgba(0,0,0,0.38);
      mat-icon { font-size: 48px; width: 48px; height: 48px; display: block; margin: 0 auto 8px; }
    }
  `]
})
export class UserListComponent implements OnInit {
  private service = inject(UsersService);
  private dialog = inject(MatDialog);
  private notifications = inject(NotificationService);

  columns = ['name', 'email', 'role', 'companies', 'status', 'actions'];
  searchCtrl = new FormControl('');
  loading = signal(true);
  result = signal<PaginatedResult<User> | null>(null);
  page = 1;
  pageSize = 20;

  ngOnInit(): void {
    this.load();
    this.searchCtrl.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.page = 1;
      this.load();
    });
  }

  load(): void {
    this.loading.set(true);
    this.service.getAll(this.page, this.pageSize, this.searchCtrl.value ?? '').subscribe({
      next: (data) => { this.result.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onPage(e: PageEvent): void {
    this.page = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.load();
  }

  deactivate(user: User): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Deactivate User',
        message: `Deactivate user "${user.username}"?`,
        confirmText: 'Deactivate',
        warn: true
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.delete(user.id).subscribe({
          next: () => { this.notifications.success('User deactivated.'); this.load(); },
          error: (err: any) => this.notifications.error(err.error?.message ?? 'Failed to deactivate user.')
        });
      }
    });
  }
}
