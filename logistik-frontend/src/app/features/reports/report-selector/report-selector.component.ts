import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environments/environment';
import { CompaniesService } from '../../companies/companies.service';
import { EmployeesService } from '../../employees/employees.service';
import { Company } from '../../../core/models/company.models';
import { Employee } from '../../../core/models/employee.models';
import { NotificationService } from '../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-report-selector',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header title="Reports" subtitle="Export employee and enforcement order reports" />

    <div class="reports-grid">
      <!-- Company Employee Export -->
      <mat-card class="report-card">
        <mat-card-header>
          <div mat-card-avatar class="report-icon blue">
            <mat-icon>people</mat-icon>
          </div>
          <mat-card-title>Employee Report</mat-card-title>
          <mat-card-subtitle>Export all employees for a company</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Select Company</mat-label>
            <mat-select [formControl]="companyCtrl" (selectionChange)="onCompanyChange($event.value)">
              @for (c of companies(); track c.id) {
                <mat-option [value]="c.id">{{ c.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions>
          <button mat-stroked-button [disabled]="!companyCtrl.value" (click)="exportCompanyEmployees('excel')">
            <mat-icon>table_view</mat-icon>
            Excel
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Individual Employee Export -->
      <mat-card class="report-card">
        <mat-card-header>
          <div mat-card-avatar class="report-icon green">
            <mat-icon>person</mat-icon>
          </div>
          <mat-card-title>Employee Detail Report</mat-card-title>
          <mat-card-subtitle>Export individual employee report</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Select Company</mat-label>
            <mat-select [formControl]="empCompanyCtrl" (selectionChange)="loadEmployees($event.value)">
              @for (c of companies(); track c.id) {
                <mat-option [value]="c.id">{{ c.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Select Employee</mat-label>
            <mat-select [formControl]="employeeCtrl" [disabled]="!empCompanyCtrl.value">
              @for (e of employees(); track e.id) {
                <mat-option [value]="e.id">{{ e.fullName }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions>
          <button mat-stroked-button [disabled]="!employeeCtrl.value" (click)="exportEmployee('pdf')">
            <mat-icon>picture_as_pdf</mat-icon>
            PDF
          </button>
          <button mat-stroked-button [disabled]="!employeeCtrl.value" (click)="exportEmployee('excel')">
            <mat-icon>table_view</mat-icon>
            Excel
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Enforcement Order Export -->
      <mat-card class="report-card">
        <mat-card-header>
          <div mat-card-avatar class="report-icon red">
            <mat-icon>gavel</mat-icon>
          </div>
          <mat-card-title>Enforcement Order Report</mat-card-title>
          <mat-card-subtitle>Export payment history for an order</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Order ID</mat-label>
            <input matInput type="number" [formControl]="orderIdCtrl" placeholder="Enter order ID" />
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions>
          <button mat-stroked-button [disabled]="!orderIdCtrl.value" (click)="exportOrder('pdf')">
            <mat-icon>picture_as_pdf</mat-icon>
            PDF
          </button>
          <button mat-stroked-button [disabled]="!orderIdCtrl.value" (click)="exportOrder('excel')">
            <mat-icon>table_view</mat-icon>
            Excel
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    .report-card { border-radius: 12px !important; }
    .report-icon {
      width: 40px; height: 40px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;

      mat-icon { color: white; }

      &.blue { background: #1976d2; }
      &.green { background: #388e3c; }
      &.red { background: #d32f2f; }
    }
    mat-card-actions { display: flex; gap: 8px; padding: 8px 16px 16px; }
  `]
})
export class ReportSelectorComponent implements OnInit {
  private companiesService = inject(CompaniesService);
  private employeesService = inject(EmployeesService);
  private http = inject(HttpClient);
  private notifications = inject(NotificationService);
  private fb = inject(FormBuilder);

  companies = signal<Company[]>([]);
  employees = signal<Employee[]>([]);

  companyCtrl = this.fb.control<number | null>(null);
  empCompanyCtrl = this.fb.control<number | null>(null);
  employeeCtrl = this.fb.control<number | null>(null);
  orderIdCtrl = this.fb.control<number | null>(null);

  ngOnInit(): void {
    this.companiesService.getAll(1, 100).subscribe(r => this.companies.set(r.items));
  }

  onCompanyChange(cId: number): void {
    // handled inline
  }

  loadEmployees(cId: number): void {
    this.employeeCtrl.reset();
    this.employeesService.getAll(cId, 1, 100).subscribe(r => this.employees.set(r.items));
  }

  exportCompanyEmployees(type: string): void {
    const cId = this.companyCtrl.value!;
    const obs = this.employeesService.exportAllExcel(cId);
    obs.subscribe(blob => this.download(blob, `employees-${cId}.xlsx`));
  }

  exportEmployee(type: 'pdf' | 'excel'): void {
    const cId = this.empCompanyCtrl.value!;
    const eId = this.employeeCtrl.value!;
    const obs = type === 'pdf'
      ? this.employeesService.exportPdf(cId, eId)
      : this.employeesService.exportExcel(cId, eId);
    const ext = type === 'pdf' ? 'pdf' : 'xlsx';
    obs.subscribe(blob => this.download(blob, `employee-${eId}.${ext}`));
  }

  exportOrder(type: 'pdf' | 'excel'): void {
    const id = this.orderIdCtrl.value!;
    const url = `${environment.apiUrl}/reports/enforcement-orders/${id}/export/${type}`;
    this.http.get(url, { responseType: 'blob' }).subscribe(
      blob => this.download(blob, `order-${id}.${type === 'pdf' ? 'pdf' : 'xlsx'}`)
    );
  }

  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
