import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompaniesService } from '../companies.service';
import { EmployeesService, ImportSalariesResult } from '../../employees/employees.service';
import { Company } from '../../../core/models/company.models';
import { EmployeeMonthlySalary } from '../../../core/models/employee.models';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { RecordSalaryDialogComponent } from '../../employees/record-salary-dialog/record-salary-dialog.component';
import { RehireDialogComponent } from '../../employees/rehire-dialog/rehire-dialog.component';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatSelectModule, MatFormFieldModule, MatButtonModule, MatButtonToggleModule,
    MatIconModule, MatTableModule, MatDialogModule, MatTooltipModule,
    MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatInputModule,
    PageHeaderComponent, TranslateModule, RehireDialogComponent
  ],
  template: `
    <app-page-header [title]="'companies.title' | translate" [subtitle]="'companies.subtitle' | translate">
      @if (authService.isAdmin()) {
        <button mat-flat-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon>
          {{ 'companies.addCompany' | translate }}
        </button>
      }
    </app-page-header>

    <div class="page-card">
      <!-- Company + month selector row -->
      <div class="selector-row">
        <mat-form-field appearance="outline" class="company-select">
          <mat-label>{{ 'companies.selectCompany' | translate }}</mat-label>
          <mat-select [formControl]="companyCtrl" (selectionChange)="onCompanySelected($event.value)">
            @for (c of companies(); track c.id) {
              <mat-option [value]="c">
                {{ c.name }}
                @if (!c.isActive) { <span class="inactive-label"> ({{ 'companies.inactiveLabel' | translate }})</span> }
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

        @if (selectedCompany()) {
          <mat-form-field appearance="outline" class="month-select">
            <mat-label>{{ 'companies.month' | translate }}</mat-label>
            <input matInput [matDatepicker]="monthPicker" [formControl]="monthCtrl"
              [max]="maxMonth" readonly (click)="monthPicker.open()" />
            <mat-datepicker-toggle matIconSuffix [for]="monthPicker" />
            <mat-datepicker #monthPicker startView="year"
              (monthSelected)="onMonthSelected($event, monthPicker)" />
          </mat-form-field>
        }

        @if (selectedCompany()) {
          <div class="company-actions">
            @if (authService.isAdmin()) {
              <button mat-stroked-button [routerLink]="[selectedCompany()!.id, 'edit']" [matTooltip]="'companies.editCompanyTooltip' | translate">
                <mat-icon>edit</mat-icon>
                {{ 'companies.editCompany' | translate }}
              </button>
              <button mat-stroked-button color="warn" (click)="deleteCompany()" [matTooltip]="'companies.deleteCompanyTooltip' | translate">
                <mat-icon>delete</mat-icon>
                {{ 'companies.deleteCompany' | translate }}
              </button>
            }
          </div>
        }
      </div>

      <!-- Employees section -->
      @if (selectedCompany()) {
        <div class="employees-section">
          <div class="section-header">
            <div class="section-header-left">
              <h3 class="section-title">
                {{ 'companies.employees' | translate }} — {{ selectedCompany()!.name }}
                <span class="month-label">{{ monthCtrl.value | date:'MMMM yyyy' }}</span>
                <span class="count-badge">{{ displayData().length }}</span>
              </h3>

              <!-- View toggle -->
              <mat-button-toggle-group [value]="viewMode()" (change)="viewMode.set($event.value)" class="view-toggle">
                <mat-button-toggle value="all" class="toggle-btn">
                  <mat-icon>people</mat-icon>
                  <span>Сите</span>
                </mat-button-toggle>
                <mat-button-toggle value="orders" class="toggle-btn">
                  <mat-icon>gavel</mat-icon>
                  <span>Извршни решенија</span>
                  @if (ordersCount() > 0) {
                    <span class="orders-badge">{{ ordersCount() }}</span>
                  }
                </mat-button-toggle>
              </mat-button-toggle-group>

            </div>

            <div class="section-header-right">
              <!-- Active/inactive toggle -->
              <button mat-stroked-button
                class="inactive-toggle"
                [class.inactive-toggle-on]="!showInactive()"
                (click)="showInactive.set(!showInactive())"
                [matTooltip]="showInactive() ? 'Прикажи само активни вработени' : 'Прикажи ги сите вработени'">
                <mat-icon>{{ showInactive() ? 'person_off' : 'people' }}</mat-icon>
                {{ showInactive() ? 'Само активни' : 'Сите вработени' }}
                @if (showInactive() && inactiveCount() > 0) {
                  <span class="inactive-badge">+{{ inactiveCount() }} одјавени</span>
                }
              </button>

              @if (viewMode() === 'orders' && ordersCount() > 0 && authService.canExportCompany(selectedCompany()!.id)) {
                <button mat-stroked-button (click)="exportOrdersExcel()" class="export-btn">
                  <mat-icon>download</mat-icon>
                  Excel
                </button>
              }
              @if (authService.canEditCompany(selectedCompany()!.id)) {
                <button mat-stroked-button (click)="fileInput.click()" [disabled]="importing()" class="import-btn">
                  <mat-icon>upload_file</mat-icon>
                  {{ importing() ? ('import.importing' | translate) : ('import.importExcel' | translate) }}
                </button>
                <input #fileInput type="file" accept=".xls,.xlsx" style="display:none" (change)="onFileSelected($event)" />
                <button mat-flat-button color="primary"
                  [routerLink]="[selectedCompany()!.id, 'employees', 'new']">
                  <mat-icon>person_add</mat-icon>
                  {{ 'employees.addEmployee' | translate }}
                </button>
              }
            </div>
          </div>

          @if (loadingEmployees()) {
            <div class="table-loading"><mat-spinner diameter="36" /></div>
          } @else {

            <!-- ALL EMPLOYEES VIEW -->
            @if (viewMode() === 'all') {
              <table mat-table [dataSource]="displayData()" class="mat-elevation-z0">

                <ng-container matColumnDef="fullName">
                  <th mat-header-cell *matHeaderCellDef>{{ 'employees.fullName' | translate }}</th>
                  <td mat-cell *matCellDef="let e">
                    <span class="employee-link" (click)="goToEmployee(e, $event)">{{ e.fullName }}</span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="embg">
                  <th mat-header-cell *matHeaderCellDef>{{ 'employees.embg' | translate }}</th>
                  <td mat-cell *matCellDef="let e">{{ e.embg }}</td>
                </ng-container>

                <ng-container matColumnDef="bankAccount">
                  <th mat-header-cell *matHeaderCellDef>{{ 'employees.bankAccount' | translate }}</th>
                  <td mat-cell *matCellDef="let e">{{ e.bankAccount }}</td>
                </ng-container>

                <ng-container matColumnDef="netSalary">
                  <th mat-header-cell *matHeaderCellDef>{{ 'employees.netSalary' | translate }} ({{ monthCtrl.value | date:'MMM yyyy' }})</th>
                  <td mat-cell *matCellDef="let e">
                    @if (e.recordedNetSalary !== null) {
                      <span class="salary-recorded">
                        {{ e.recordedNetSalary | number:'1.2-2' }} ден.
                        @if (e.deductionAmount && e.deductionAmount > 0) {
                          <span class="deduction-hint">(-{{ e.deductionAmount | number:'1.2-2' }})</span>
                        }
                      </span>
                    } @else {
                      <span class="salary-missing">—</span>
                    }
                  </td>
                </ng-container>

                <ng-container matColumnDef="startDate">
                  <th mat-header-cell *matHeaderCellDef>{{ 'employees.startDate' | translate }}</th>
                  <td mat-cell *matCellDef="let e">{{ e.employmentStartDate | date:'dd.MM.yyyy' }}</td>
                </ng-container>

                <ng-container matColumnDef="endDate">
                  <th mat-header-cell *matHeaderCellDef>{{ 'employees.endDate' | translate }}</th>
                  <td mat-cell *matCellDef="let e">
                    {{ e.employmentEndDate ? (e.employmentEndDate | date:'dd.MM.yyyy') : '—' }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef></th>
                  <td mat-cell *matCellDef="let e" class="actions-cell" (click)="$event.stopPropagation()">
                    @if (e.employmentEndDate && authService.canEditCompany(selectedCompany()!.id)) {
                      <!-- Terminated employee: show re-hire button -->
                      <button mat-stroked-button color="primary" (click)="rehireEmployee(e)"
                        class="rehire-btn" matTooltip="Врати на работа со нов датум">
                        <mat-icon>how_to_reg</mat-icon>
                        Врати
                      </button>
                    } @else if (authService.canEditCompany(selectedCompany()!.id)) {
                      @if (e.recordedNetSalary !== null) {
                        <button mat-icon-button color="accent" (click)="editSalary(e)"
                          [matTooltip]="'employees.editRecordedSalary' | translate">
                          <mat-icon>edit_note</mat-icon>
                        </button>
                      } @else if (isMonthValidForEmployee(e)) {
                        <button mat-icon-button color="primary" (click)="recordSalary(e)"
                          [matTooltip]="('employees.recordSalaryTooltip' | translate: {month: (monthCtrl.value | date:'MMMM yyyy')})">
                          <mat-icon>payments</mat-icon>
                        </button>
                      }
                    }
                    @if (!e.employmentEndDate) {
                      <button mat-icon-button (click)="goToEmployee(e, $event)" [matTooltip]="'employees.viewDetails' | translate">
                        <mat-icon>visibility</mat-icon>
                      </button>
                    }
                    @if (authService.canEditCompany(selectedCompany()!.id) && !e.employmentEndDate) {
                      <button mat-icon-button (click)="goToEmployeeEdit(e, $event)" [matTooltip]="'employees.editTooltip' | translate">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="deleteEmployee(e)" [matTooltip]="'employees.deleteTooltip' | translate">
                        <mat-icon>delete</mat-icon>
                      </button>
                    }
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="allColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: allColumns;"
                  class="employee-row" (click)="goToEmployee(row, $event)"
                  [class.row-terminated]="row.employmentEndDate"></tr>
                <tr class="mat-row" *matNoDataRow>
                  <td class="mat-cell empty-state" [attr.colspan]="allColumns.length">
                    <mat-icon>people_outline</mat-icon>
                    <p>{{ 'employees.noEmployees' | translate }}</p>
                  </td>
                </tr>
              </table>
            }

            <!-- ENFORCEMENT ORDERS VIEW -->
            @if (viewMode() === 'orders') {
              <table mat-table [dataSource]="displayData()" class="mat-elevation-z0">

                <ng-container matColumnDef="fullName">
                  <th mat-header-cell *matHeaderCellDef>Вработен</th>
                  <td mat-cell *matCellDef="let e">
                    <span class="employee-link" (click)="goToEmployee(e, $event)">{{ e.fullName }}</span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="executorName">
                  <th mat-header-cell *matHeaderCellDef>Извршител</th>
                  <td mat-cell *matCellDef="let e">{{ e.executorName }}</td>
                </ng-container>

                <ng-container matColumnDef="executorBankAccount">
                  <th mat-header-cell *matHeaderCellDef>Трансакциска сметка</th>
                  <td mat-cell *matCellDef="let e" class="bank-cell">{{ e.executorBankAccount }}</td>
                </ng-container>

                <ng-container matColumnDef="orderNumber">
                  <th mat-header-cell *matHeaderCellDef>И.бр.</th>
                  <td mat-cell *matCellDef="let e">
                    <span class="order-number">{{ e.orderNumber }}</span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="deductionAmount">
                  <th mat-header-cell *matHeaderCellDef>Износ 1/5</th>
                  <td mat-cell *matCellDef="let e">
                    @if (e.deductionAmount !== null && e.deductionAmount > 0) {
                      <span class="amount-recorded">{{ e.deductionAmount | number:'1.2-2' }} ден.</span>
                    } @else {
                      <span class="text-muted">—</span>
                    }
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef></th>
                  <td mat-cell *matCellDef="let e" class="actions-cell" (click)="$event.stopPropagation()">
                    @if (authService.canEditCompany(selectedCompany()!.id)) {
                      @if (e.recordedNetSalary !== null) {
                        <button mat-icon-button color="accent" (click)="editSalary(e)"
                          [matTooltip]="'employees.editRecordedSalary' | translate">
                          <mat-icon>edit_note</mat-icon>
                        </button>
                      } @else if (isMonthValidForEmployee(e)) {
                        <button mat-icon-button color="primary" (click)="recordSalary(e)"
                          [matTooltip]="('employees.recordSalaryTooltip' | translate: {month: (monthCtrl.value | date:'MMMM yyyy')})">
                          <mat-icon>payments</mat-icon>
                        </button>
                      }
                    }
                    <button mat-icon-button (click)="goToEmployee(e, $event)" [matTooltip]="'employees.viewDetails' | translate">
                      <mat-icon>visibility</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="ordersColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: ordersColumns;"
                  class="employee-row" (click)="goToEmployee(row, $event)"
                  [class.salary-paid]="row.deductionAmount !== null"></tr>
                <tr class="mat-row" *matNoDataRow>
                  <td class="mat-cell empty-state" [attr.colspan]="ordersColumns.length">
                    <mat-icon>gavel</mat-icon>
                    <p>Нема вработени со активни извршни решенија за овој месец.</p>
                  </td>
                </tr>
              </table>
            }
          }
        </div>
      } @else {
        <div class="no-selection">
          <mat-icon>business</mat-icon>
          <p>{{ 'companies.noSelection' | translate }}</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .selector-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 16px 0;
      flex-wrap: wrap;
    }
    .company-select { width: 320px; min-width: 200px; }
    .month-select { width: 200px; }
    .company-actions { display: flex; gap: 8px; }
    .inactive-label { color: rgba(0,0,0,0.38); font-size: 12px; }

    .employees-section { padding: 0 0 16px; }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 16px 12px;
      gap: 12px;
      flex-wrap: wrap;
    }
    .section-header-left { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .section-header-right { display: flex; align-items: center; gap: 8px; }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .month-label { font-size: 13px; font-weight: 400; color: rgba(0,0,0,0.54); }
    .count-badge {
      background: #e8eaf6; color: #3949ab;
      border-radius: 12px; padding: 2px 10px;
      font-size: 12px; font-weight: 600;
    }
    .view-toggle { height: 36px; }
    :host ::ng-deep .toggle-btn .mat-button-toggle-label-content {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
      padding: 0 14px !important;
      line-height: 36px !important;
    }
    .orders-badge {
      background: #c62828; color: #fff;
      border-radius: 10px; padding: 1px 7px;
      font-size: 11px; font-weight: 700;
      display: inline-flex; align-items: center; justify-content: center;
      line-height: 16px; height: 16px; min-width: 16px;
    }
    .export-btn { color: #2e7d32; border-color: #2e7d32; }

    .table-loading { display: flex; justify-content: center; padding: 48px; }
    .actions-cell { text-align: right; white-space: nowrap; }
    .employee-row { cursor: pointer; }
    .employee-row:hover { background: rgba(57,73,171,0.04); }
    .employee-link { color: #3949ab; font-weight: 500; cursor: pointer; }
    .employee-link:hover { text-decoration: underline; }
    .salary-recorded { color: #2e7d32; font-weight: 500; }
    .salary-missing { color: rgba(0,0,0,0.38); }
    .deduction-hint { font-size: 11px; color: #e53935; margin-left: 4px; }
    .order-number { font-weight: 600; font-size: 13px; color: #1565c0; }
    .bank-cell { font-size: 12px; color: rgba(0,0,0,0.7); }
    .amount-recorded { color: #c62828; font-weight: 700; }
    .text-muted { color: rgba(0,0,0,0.38); }
    :host ::ng-deep .salary-paid { background: #e8f5e9 !important; }
    :host ::ng-deep .row-terminated { background: #fff3e0 !important; }
    :host ::ng-deep .row-terminated td { color: rgba(0,0,0,0.5); font-style: italic; }

    .inactive-toggle {
      height: 36px; font-size: 12px; padding: 0 12px;
      color: rgba(0,0,0,0.45); border-color: rgba(0,0,0,0.2);
      display: flex; align-items: center; gap: 6px;
    }
    .inactive-toggle mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .inactive-toggle-on {
      color: #e65100 !important;
      border-color: #e65100 !important;
      background: #fff3e0 !important;
    }
    .inactive-badge {
      background: #e65100; color: #fff;
      border-radius: 10px; padding: 1px 7px;
      font-size: 11px; font-weight: 700;
      display: inline-flex; align-items: center; margin-left: 4px;
    }
    .rehire-btn { font-size: 12px; height: 30px; padding: 0 10px; }

    .no-selection {
      text-align: center; padding: 64px; color: rgba(0,0,0,0.38);
      mat-icon { font-size: 56px; width: 56px; height: 56px; display: block; margin: 0 auto 12px; }
      p { font-size: 15px; }
    }
    .empty-state {
      text-align: center; padding: 48px; color: rgba(0,0,0,0.38);
      mat-icon { font-size: 48px; width: 48px; height: 48px; display: block; margin: 0 auto 8px; }
    }
  `]
})
export class CompanyListComponent implements OnInit {
  private companiesService = inject(CompaniesService);
  private employeesService = inject(EmployeesService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private notifications = inject(NotificationService);
  private translate = inject(TranslateService);
  authService = inject(AuthService);

  companies = signal<Company[]>([]);
  selectedCompany = signal<Company | null>(null);
  monthlyData = signal<EmployeeMonthlySalary[]>([]);
  loadingEmployees = signal(false);
  importing = signal(false);
  viewMode = signal<'all' | 'orders'>('all');
  showInactive = signal(true);

  companyCtrl = new FormControl<Company | null>(null);
  monthCtrl = new FormControl<Date | null>(this.currentMonth());
  maxMonth = new Date();

  allColumns = ['fullName', 'embg', 'bankAccount', 'netSalary', 'startDate', 'endDate', 'actions'];
  ordersColumns = ['fullName', 'executorName', 'executorBankAccount', 'orderNumber', 'deductionAmount', 'actions'];

  private hasActiveOrderForMonth = (e: EmployeeMonthlySalary) =>
    e.salaryRecordId !== null && (e.deductionAmount ?? 0) > 0;

  private isTerminated = (e: EmployeeMonthlySalary) => !!e.employmentEndDate;

  displayData = computed(() => {
    let data = this.monthlyData();
    if (!this.showInactive()) data = data.filter(e => !this.isTerminated(e));
    if (this.viewMode() === 'orders') data = data.filter(this.hasActiveOrderForMonth);
    return data;
  });

  ordersCount = computed(() => this.monthlyData().filter(this.hasActiveOrderForMonth).length);
  inactiveCount = computed(() => this.monthlyData().filter(this.isTerminated).length);

  private currentMonth(): Date {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  ngOnInit(): void {
    const preselect: number | undefined = (history.state as any)?.selectedCompanyId;
    this.companiesService.getAllForDropdown().subscribe(list => {
      this.companies.set(list);
      if (preselect) {
        const company = list.find(c => c.id === preselect);
        if (company) { this.companyCtrl.setValue(company); this.onCompanySelected(company); }
      }
    });
  }

  onCompanySelected(company: Company): void {
    this.selectedCompany.set(company);
    this.loadMonthlyData();
  }

  onMonthSelected(date: Date, picker: any): void {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    this.monthCtrl.setValue(first);
    picker.close();
    if (this.selectedCompany()) this.loadMonthlyData();
  }

  loadMonthlyData(): void {
    const company = this.selectedCompany();
    if (!company) return;
    const month = this.monthCtrl.value ?? this.currentMonth();
    this.loadingEmployees.set(true);
    this.employeesService.getMonthlySalary(company.id, month.getFullYear(), month.getMonth() + 1).subscribe({
      next: data => { this.monthlyData.set(data); this.loadingEmployees.set(false); },
      error: () => this.loadingEmployees.set(false)
    });
  }

  exportOrdersExcel(): void {
    const company = this.selectedCompany();
    if (!company) return;
    const m = this.monthCtrl.value ?? this.currentMonth();
    this.employeesService.exportEnforcementDeductionsExcel(company.id, m.getFullYear(), m.getMonth() + 1).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `izvrsni-${company.name}-${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  goToEmployee(emp: EmployeeMonthlySalary, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/companies', this.selectedCompany()!.id, 'employees', emp.id]);
  }

  goToEmployeeEdit(emp: EmployeeMonthlySalary, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/companies', this.selectedCompany()!.id, 'employees', emp.id, 'edit']);
  }

  editSalary(emp: EmployeeMonthlySalary): void {
    const m = this.monthCtrl.value ?? this.currentMonth();
    this.dialog.open(RecordSalaryDialogComponent, {
      width: '480px',
      data: {
        companyId: this.selectedCompany()!.id,
        employeeId: emp.id,
        netSalary: emp.netSalary,
        prefilledMonth: new Date(m.getFullYear(), m.getMonth(), 1),
        salaryRecordId: emp.salaryRecordId,
        recordedNetSalary: emp.recordedNetSalary
      }
    }).afterClosed().subscribe(saved => {
      if (saved) { this.notifications.success(this.translate.instant('salary.saveChanges')); this.loadMonthlyData(); }
    });
  }

  recordSalary(emp: EmployeeMonthlySalary): void {
    const m = this.monthCtrl.value ?? this.currentMonth();
    this.dialog.open(RecordSalaryDialogComponent, {
      width: '480px',
      data: { companyId: this.selectedCompany()!.id, employeeId: emp.id, netSalary: emp.netSalary, prefilledMonth: new Date(m.getFullYear(), m.getMonth(), 1) }
    }).afterClosed().subscribe(saved => {
      if (saved) { this.notifications.success(this.translate.instant('salary.record')); this.loadMonthlyData(); }
    });
  }

  isMonthValidForEmployee(emp: EmployeeMonthlySalary): boolean {
    const month = this.monthCtrl.value ?? this.currentMonth();
    const start = new Date(emp.employmentStartDate);
    return month >= new Date(start.getFullYear(), start.getMonth(), 1);
  }

  rehireEmployee(emp: EmployeeMonthlySalary): void {
    this.dialog.open(RehireDialogComponent, {
      width: '460px',
      maxWidth: '96vw',
      data: { companyId: this.selectedCompany()!.id, employee: emp }
    }).afterClosed().subscribe(success => {
      if (success) {
        this.notifications.success(`${emp.fullName} е вратен/а на работа.`);
        this.loadMonthlyData();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    const company = this.selectedCompany();
    if (!company) return;
    const m = this.monthCtrl.value ?? this.currentMonth();

    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('import.confirmTitle'),
        message: this.translate.instant('import.confirmMessage', {
          file: file.name,
          month: m.toLocaleDateString('mk-MK', { month: 'long', year: 'numeric' }),
          company: company.name
        }),
        confirmText: this.translate.instant('import.importExcel'),
        warn: false
      }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.importing.set(true);
      this.employeesService.importSalaries(company.id, m.getFullYear(), m.getMonth() + 1, file).subscribe({
        next: (result: ImportSalariesResult) => {
          this.importing.set(false);
          this.showImportResult(result);
          this.loadMonthlyData();
        },
        error: (err: any) => {
          this.importing.set(false);
          this.notifications.error(err.error?.message ?? this.translate.instant('errors.failedToLoad'));
        }
      });
    });
  }

  private showImportResult(result: ImportSalariesResult): void {
    let msg = this.translate.instant('import.resultImported', { count: result.imported });
    if (result.alreadyRecorded > 0)
      msg += '\n' + this.translate.instant('import.resultAlready', { count: result.alreadyRecorded });
    if (result.notFound.length > 0)
      msg += '\n' + this.translate.instant('import.resultNotFound', { count: result.notFound.length }) +
             '\n' + result.notFound.join('\n');

    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('import.resultTitle'),
        message: msg,
        confirmText: this.translate.instant('common.close'),
        warn: result.notFound.length > 0,
        hideCancel: true
      }
    });
  }

  deleteCompany(): void {
    const company = this.selectedCompany();
    if (!company) return;
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('companies.deleteCompany'),
        message: this.translate.instant('companies.deleteCompanyConfirm', { name: company.name }),
        confirmText: this.translate.instant('common.delete'),
        warn: true
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.companiesService.delete(company.id).subscribe({
          next: () => {
            this.notifications.success(this.translate.instant('companies.deleteCompany'));
            this.selectedCompany.set(null);
            this.companyCtrl.setValue(null);
            this.monthlyData.set([]);
            this.companiesService.getAllForDropdown().subscribe(list => this.companies.set(list));
          },
          error: (err: any) => this.notifications.error(err.error?.message ?? this.translate.instant('errors.failedToLoad'))
        });
      }
    });
  }

  deleteEmployee(emp: EmployeeMonthlySalary): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('employees.deleteEmployee'),
        message: this.translate.instant('employees.deleteEmployeeConfirm', { name: emp.fullName }),
        confirmText: this.translate.instant('common.delete'),
        warn: true
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.employeesService.delete(this.selectedCompany()!.id, emp.id).subscribe({
          next: () => { this.notifications.success(this.translate.instant('common.delete')); this.loadMonthlyData(); },
          error: (err: any) => this.notifications.error(err.error?.message ?? this.translate.instant('errors.failedToLoad'))
        });
      }
    });
  }
}
