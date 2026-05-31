import { Component, Input, inject, OnInit, OnChanges, signal } from '@angular/core';
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
import { EmployeesService } from '../employees.service';
import { Employee } from '../../../core/models/employee.models';
import { PaginatedResult } from '../../../core/models/pagination.models';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ExportButtonsComponent } from '../../../shared/components/export-buttons/export-buttons.component';
import { CurrencyMkPipe } from '../../../shared/pipes/currency-mk.pipe';
import { EmbgMaskPipe } from '../../../shared/pipes/embg-mask.pipe';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatPaginatorModule, MatTooltipModule,
    MatProgressSpinnerModule, MatDialogModule,
    ExportButtonsComponent, CurrencyMkPipe, EmbgMaskPipe
  ],
  template: `
    <div class="page-card">
      <div class="list-header">
        <h2 class="section-title">Employees</h2>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search</mat-label>
            <input matInput [formControl]="searchCtrl" />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <app-export-buttons
            [disabled]="!authService.canExportCompany(companyId)"
            (exportPdf)="exportAll('pdf')"
            (exportExcel)="exportAll('excel')"
          />
          @if (authService.canEditCompany(companyId)) {
            <button mat-flat-button color="primary" [routerLink]="['/companies', companyId, 'employees', 'new']">
              <mat-icon>person_add</mat-icon>
              Add Employee
            </button>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="table-loading"><mat-spinner diameter="36" /></div>
      } @else {
        <table mat-table [dataSource]="result()?.items ?? []" class="mat-elevation-z0">
          <ng-container matColumnDef="fullName">
            <th mat-header-cell *matHeaderCellDef>Full Name</th>
            <td mat-cell *matCellDef="let e"><strong>{{ e.fullName }}</strong></td>
          </ng-container>

          <ng-container matColumnDef="embg">
            <th mat-header-cell *matHeaderCellDef>EMBG</th>
            <td mat-cell *matCellDef="let e">{{ e.embg | embgMask }}</td>
          </ng-container>

          <ng-container matColumnDef="startDate">
            <th mat-header-cell *matHeaderCellDef>Start Date</th>
            <td mat-cell *matCellDef="let e">{{ e.employmentStartDate | date:'dd.MM.yyyy' }}</td>
          </ng-container>

          <ng-container matColumnDef="endDate">
            <th mat-header-cell *matHeaderCellDef>End Date</th>
            <td mat-cell *matCellDef="let e">{{ e.employmentEndDate ? (e.employmentEndDate | date:'dd.MM.yyyy') : '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="netSalary">
            <th mat-header-cell *matHeaderCellDef>Net Salary</th>
            <td mat-cell *matCellDef="let e">{{ e.netSalary | currencyMk }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let e" class="actions-cell">
              <button mat-icon-button
                [routerLink]="['/companies', companyId, 'employees', e.id]"
                matTooltip="View details">
                <mat-icon>visibility</mat-icon>
              </button>
              @if (authService.canEditCompany(companyId)) {
                <button mat-icon-button
                  [routerLink]="['/companies', companyId, 'employees', e.id, 'edit']"
                  matTooltip="Edit">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="delete(e)" matTooltip="Delete">
                  <mat-icon>person_remove</mat-icon>
                </button>
              }
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"
              [class.row-terminated]="row.employmentEndDate"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell empty-state" [attr.colspan]="columns.length">
              <mat-icon>people_outline</mat-icon>
              <p>No employees found</p>
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
    .list-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 16px 0;
      flex-wrap: wrap;
      gap: 12px;
    }
    .section-title { font-size: 18px; font-weight: 600; margin: 0; }
    .header-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .search-field { width: 220px; }
    .table-loading { display: flex; justify-content: center; padding: 48px; }
    .actions-cell { text-align: right; white-space: nowrap; }
    .empty-state {
      text-align: center; padding: 48px; color: rgba(0,0,0,0.38);
      mat-icon { font-size: 48px; width: 48px; height: 48px; display: block; margin: 0 auto 8px; }
    }
    :host ::ng-deep .row-terminated { background-color: #ffebee !important; }
    :host ::ng-deep .row-terminated:hover { background-color: #ffcdd2 !important; }
  `]
})
export class EmployeeListComponent implements OnInit, OnChanges {
  @Input({ required: true }) companyId!: number;

  private service = inject(EmployeesService);
  private dialog = inject(MatDialog);
  private notifications = inject(NotificationService);
  authService = inject(AuthService);

  columns = ['fullName', 'embg', 'startDate', 'endDate', 'netSalary', 'actions'];
  searchCtrl = new FormControl('');
  loading = signal(true);
  result = signal<PaginatedResult<Employee> | null>(null);
  page = 1;
  pageSize = 20;

  ngOnInit(): void {
    this.load();
    this.searchCtrl.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.page = 1;
      this.load();
    });
  }

  ngOnChanges(): void {
    if (this.companyId) this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.getAll(this.companyId, this.page, this.pageSize, this.searchCtrl.value ?? '').subscribe({
      next: (data) => { this.result.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onPage(e: PageEvent): void {
    this.page = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.load();
  }

  delete(employee: Employee): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remove Employee',
        message: `Remove "${employee.fullName}" from this company?`,
        confirmText: 'Remove',
        warn: true
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.delete(this.companyId, employee.id).subscribe({
          next: () => { this.notifications.success('Employee removed.'); this.load(); },
          error: (err: any) => this.notifications.error(err.error?.message ?? 'Failed to remove employee.')
        });
      }
    });
  }

  exportAll(type: 'pdf' | 'excel'): void {
    const obs = type === 'excel' ? this.service.exportAllExcel(this.companyId) : null;
    if (!obs) return;
    obs.subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees-${this.companyId}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
