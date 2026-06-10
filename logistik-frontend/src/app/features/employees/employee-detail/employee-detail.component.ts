import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmployeesService } from '../employees.service';
import { Employee, SalaryHistory, EmploymentHistory } from '../../../core/models/employee.models';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ExportButtonsComponent } from '../../../shared/components/export-buttons/export-buttons.component';
import { CurrencyMkPipe } from '../../../shared/pipes/currency-mk.pipe';
import { EmbgMaskPipe } from '../../../shared/pipes/embg-mask.pipe';
import { EnforcementOrdersService } from '../../enforcement-orders/enforcement-orders.service';
import { EnforcementOrder } from '../../../core/models/enforcement-order.models';
import { RecordSalaryDialogComponent } from '../record-salary-dialog/record-salary-dialog.component';
import { OrderFormDialogComponent } from '../../enforcement-orders/order-form-dialog/order-form-dialog.component';
import { ExecutorDialogComponent } from '../../enforcement-orders/executor-dialog/executor-dialog.component';
import { EmailPreviewDialogComponent } from '../../enforcement-orders/email-preview-dialog/email-preview-dialog.component';
import { TerminationEmailsDialogComponent } from '../termination-emails-dialog/termination-emails-dialog.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatTabsModule,
    MatTableModule, MatDialogModule, MatProgressSpinnerModule, MatTooltipModule,
    PageHeaderComponent, StatusBadgeComponent, ExportButtonsComponent,
    CurrencyMkPipe, EmbgMaskPipe, TranslateModule
  ],
  template: `
    @if (employee()) {
      <app-page-header [title]="employee()!.fullName" [subtitle]="'employees.employeeDetails' | translate">
        <button mat-stroked-button routerLink="/companies">
          <mat-icon>arrow_back</mat-icon>
          {{ 'common.back' | translate }}
        </button>
        @if (authService.canExportCompany(companyId)) {
          <app-export-buttons (exportPdf)="exportEmployee('pdf')" (exportExcel)="exportEmployee('excel')" />
        }
        @if (authService.canEditCompany(companyId)) {
          <button mat-stroked-button [routerLink]="['/companies', companyId, 'employees', employeeId, 'edit']">
            <mat-icon>edit</mat-icon>
            {{ 'common.edit' | translate }}
          </button>
        }
      </app-page-header>

      <mat-tab-group (selectedTabChange)="onTabChange($event)">
        <!-- Tab 1: Info -->
        <mat-tab [label]="'employees.info' | translate">
          <div class="tab-content">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">{{ 'employees.embg' | translate }}</span>
                <span class="info-value">{{ employee()!.embg | embgMask:false }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ 'employees.bankAccount' | translate }}</span>
                <span class="info-value">{{ employee()!.bankAccount }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ 'salary.netSalary' | translate }}</span>
                <span class="info-value">{{ employee()!.netSalary | currencyMk }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ 'employees.monthlyDeduction' | translate }}</span>
                <span class="info-value">{{ employee()!.netSalary / 5 | currencyMk }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ 'employees.startDate' | translate }}</span>
                <span class="info-value">{{ employee()!.employmentStartDate | date:'dd.MM.yyyy' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ 'employees.endDate' | translate }}</span>
                <span class="info-value">{{ employee()!.employmentEndDate ? (employee()!.employmentEndDate | date:'dd.MM.yyyy') : ('employees.currentlyEmployed' | translate) }}</span>
              </div>
            </div>

            @if (employee()!.employmentEndDate && authService.canEditCompany(companyId)) {
              <div class="termination-notice">
                <mat-icon class="term-icon">person_off</mat-icon>
                <div class="term-text">
                  <span>Работникот е одјавен на {{ employee()!.employmentEndDate | date:'dd.MM.yyyy' }}</span>
                </div>
                <button mat-stroked-button color="warn" (click)="openTerminationEmails()" class="term-notify-btn">
                  <mat-icon>mail_lock</mat-icon>
                  Известувања
                </button>
              </div>
            }

            @if (employee()!.employmentHistories?.length) {
              <div class="history-section">
                <h4 class="history-title">
                  <mat-icon class="history-icon">history</mat-icon>
                  Претходни периоди на вработување
                </h4>
                <div class="history-list">
                  @for (h of employee()!.employmentHistories; track h.id) {
                    <div class="history-entry">
                      <mat-icon class="entry-icon">work_history</mat-icon>
                      <span class="entry-dates">
                        {{ h.startDate | date:'dd.MM.yyyy' }}
                        <span class="entry-arrow">→</span>
                        {{ h.endDate | date:'dd.MM.yyyy' }}
                      </span>
                      <span class="entry-duration">({{ durationLabel(h) }})</span>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </mat-tab>

        <!-- Tab 2: Salary History -->
        <mat-tab [label]="'employees.salaryHistory' | translate">
          <div class="tab-content">
            @if (loadingSalary() && salaryHistory().length === 0) {
              <div class="loading-row"><mat-spinner diameter="32" /></div>
            } @else {
              <table mat-table [dataSource]="salaryHistory()" class="mat-elevation-z0">
                <ng-container matColumnDef="month">
                  <th mat-header-cell *matHeaderCellDef>{{ 'salary.month' | translate }}</th>
                  <td mat-cell *matCellDef="let s">{{ s.salaryMonth | date:'MMMM yyyy' }}</td>
                </ng-container>
                <ng-container matColumnDef="netSalary">
                  <th mat-header-cell *matHeaderCellDef>{{ 'salary.netSalary' | translate }}</th>
                  <td mat-cell *matCellDef="let s">{{ s.netSalary | currencyMk }}</td>
                </ng-container>
                <ng-container matColumnDef="deduction">
                  <th mat-header-cell *matHeaderCellDef>{{ 'salary.deduction' | translate }}</th>
                  <td mat-cell *matCellDef="let s">
                    @if (s.deductionAmount > 0 || s.overflowDeductionAmount) {
                      <div [class]="deductionClass(s)">
                        <span class="deduction-amount">{{ s.deductionAmount | currencyMk }}</span>
                        @if (s.orderNumber) {
                          <span class="order-ref">{{ s.orderNumber }}{{ s.executorName ? ' / ' + s.executorName : '' }}</span>
                        }
                      </div>
                      @if (s.overflowDeductionAmount) {
                        <div class="ded-split">
                          <span class="deduction-amount">{{ s.overflowDeductionAmount | currencyMk }}</span>
                          @if (s.overflowOrderNumber) {
                            <span class="order-ref">{{ s.overflowOrderNumber }}{{ s.overflowExecutorName ? ' / ' + s.overflowExecutorName : '' }}</span>
                          }
                        </div>
                      }
                    } @else {
                      <span class="text-muted">—</span>
                    }
                  </td>
                </ng-container>
                <ng-container matColumnDef="net">
                  <th mat-header-cell *matHeaderCellDef>{{ 'salary.netPaid' | translate }}</th>
                  <td mat-cell *matCellDef="let s">{{ (s.netSalary - s.deductionAmount - (s.overflowDeductionAmount ?? 0)) | currencyMk }}</td>
                </ng-container>
                <ng-container matColumnDef="notes">
                  <th mat-header-cell *matHeaderCellDef>{{ 'salary.notes' | translate }}</th>
                  <td mat-cell *matCellDef="let s" class="notes-cell">
                    @if (s.notes) {
                      <span [matTooltip]="s.notes" class="notes-text">{{ s.notes }}</span>
                    } @else {
                      <span class="text-muted">—</span>
                    }
                  </td>
                </ng-container>
                <ng-container matColumnDef="recordedBy">
                  <th mat-header-cell *matHeaderCellDef>{{ 'salary.recordedBy' | translate }}</th>
                  <td mat-cell *matCellDef="let s">{{ s.recordedByUsername }}</td>
                </ng-container>

                <ng-container matColumnDef="paymentOrder">
                  <th mat-header-cell *matHeaderCellDef></th>
                  <td mat-cell *matCellDef="let s" class="payment-order-cell">
                    @if (s.deductionAmount > 0) {
                      <button mat-icon-button
                        (click)="downloadPaymentOrder(s.id, false)"
                        [matTooltip]="s.orderNumber ? ('Налог: ' + s.orderNumber) : 'Налог за плаќање'"
                        class="btn-nalog">
                        <mat-icon>picture_as_pdf</mat-icon>
                      </button>
                    }
                    @if (s.overflowDeductionAmount) {
                      <button mat-icon-button
                        (click)="downloadPaymentOrder(s.id, true)"
                        [matTooltip]="s.overflowOrderNumber ? ('Налог: ' + s.overflowOrderNumber) : 'Налог за плаќање (2)'"
                        class="btn-nalog btn-nalog-2">
                        <mat-icon>picture_as_pdf</mat-icon>
                      </button>
                    }
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="salaryColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: salaryColumns;"
                  [class.row-paid-off]="row.remainingAfterDeduction !== null && row.remainingAfterDeduction <= 0"></tr>
                <tr class="mat-row" *matNoDataRow>
                  <td class="mat-cell empty-state" [attr.colspan]="salaryColumns.length">{{ 'employees.noSalaryRecords' | translate }}</td>
                </tr>
              </table>

              @if (salaryHasMore()) {
                <div class="load-more-row">
                  <button mat-stroked-button (click)="loadMoreSalary()" [disabled]="loadingSalary()">
                    @if (loadingSalary()) { <mat-spinner diameter="16" /> }
                    {{ 'employees.loadMore' | translate }}
                  </button>
                </div>
              }
            }
          </div>
        </mat-tab>

        <!-- Tab 3: Enforcement Orders -->
        <mat-tab [label]="'employees.enforcementOrders' | translate">
          <div class="tab-content">
            <div class="tab-header">
              @if (authService.canEditCompany(companyId)) {
                <button mat-stroked-button (click)="openAddExecutor()" style="margin-right:8px">
                  <mat-icon>person_add</mat-icon>
                  {{ 'orders.addExecutor' | translate }}
                </button>
                <button mat-flat-button color="primary" (click)="openNewOrder()">
                  <mat-icon>add</mat-icon>
                  {{ 'orders.addOrder' | translate }}
                </button>
              }
            </div>

            <table mat-table [dataSource]="orders()" class="mat-elevation-z0">
              <ng-container matColumnDef="orderNumber">
                <th mat-header-cell *matHeaderCellDef>{{ 'orders.orderNo' | translate }}</th>
                <td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td>
              </ng-container>
              <ng-container matColumnDef="executor">
                <th mat-header-cell *matHeaderCellDef>{{ 'orders.executor' | translate }}</th>
                <td mat-cell *matCellDef="let o">{{ o.executorName }}</td>
              </ng-container>
              <ng-container matColumnDef="total">
                <th mat-header-cell *matHeaderCellDef>{{ 'orders.totalAmount' | translate }}</th>
                <td mat-cell *matCellDef="let o">{{ o.totalAmount | currencyMk }}</td>
              </ng-container>
              <ng-container matColumnDef="remaining">
                <th mat-header-cell *matHeaderCellDef>{{ 'orders.remaining' | translate }}</th>
                <td mat-cell *matCellDef="let o">{{ o.remainingAmount | currencyMk }}</td>
              </ng-container>
              <ng-container matColumnDef="receivedDate">
                <th mat-header-cell *matHeaderCellDef>{{ 'orders.received' | translate }}</th>
                <td mat-cell *matCellDef="let o">{{ o.receivedDate | date:'dd.MM.yyyy' }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>{{ 'orders.status' | translate }}</th>
                <td mat-cell *matCellDef="let o">
                  <app-status-badge [status]="o.status" [statusColor]="o.statusColor" />
                </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let o" class="actions-cell">
                  <button mat-icon-button matTooltip="Испрати мејл" (click)="openEmailPreview(o)">
                    <mat-icon style="color:#3949ab">email</mat-icon>
                  </button>
                  @if (authService.canEditCompany(companyId)) {
                    <button mat-icon-button matTooltip="Избриши налог" (click)="deleteOrder(o)">
                      <mat-icon style="color:#c62828">delete</mat-icon>
                    </button>
                  }
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="orderColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: orderColumns;"
                [class.row-order-yellow]="row.statusColor === 'yellow'"
                [class.row-order-green]="row.statusColor === 'green'"
              ></tr>
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell empty-state" [attr.colspan]="orderColumns.length">{{ 'orders.noOrders' | translate }}</td>
              </tr>
            </table>
          </div>
        </mat-tab>
      </mat-tab-group>
    }
  `,
  styles: [`
    .tab-content { padding: 24px 0; }
    .tab-header { display: flex; justify-content: flex-end; margin-bottom: 16px; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .info-label { font-size: 12px; color: rgba(0,0,0,0.54); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-value { font-size: 14px; font-weight: 500; }
    .actions-cell { text-align: right; }
    .empty-state { text-align: center; padding: 32px; color: rgba(0,0,0,0.38); }
    .text-warn { color: #e53935; font-weight: 500; }
    .text-muted { color: rgba(0,0,0,0.38); }
    .loading-row { display: flex; justify-content: center; padding: 48px; }
    .load-more-row { display: flex; justify-content: center; padding: 16px 0; }
    .notes-cell { max-width: 200px; }
    .notes-text { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: default; font-size: 13px; color: rgba(0,0,0,0.7); }
    .deduction-amount { font-weight: 600; font-size: 13px; display: block; }
    .order-ref { font-size: 11px; color: rgba(0,0,0,0.45); margin-top: 1px; display: block; }
    .ded-green .deduction-amount { color: #2e7d32; }
    .ded-red .deduction-amount { color: #c62828; }
    .ded-orange .deduction-amount { color: #e65100; }
    .ded-default .deduction-amount { color: rgba(0,0,0,0.87); }
    .ded-split { margin-top: 6px; padding-top: 6px; border-top: 1px dashed #bdbdbd; }
    .ded-split .deduction-amount { color: #1565c0; font-weight: 600; font-size: 13px; display: block; }
    .ded-split .order-ref { font-size: 11px; color: rgba(0,0,0,0.45); margin-top: 1px; display: block; }
    .row-paid-off { background: #e8f5e9 !important; }
    .row-paid-off td { color: #2e7d32; }
    .row-order-green { background: #e8f5e9 !important; }
    .row-order-green td { color: #2e7d32; }
    .row-order-yellow { background: #fff8e1 !important; }
    .row-order-yellow td { color: #e65100; font-weight: 500; }
    .payment-order-cell { white-space: nowrap; text-align: right; padding-right: 4px; }
    .btn-nalog { color: #c62828; }
    .btn-nalog-2 { color: #1565c0; }
    .termination-notice { display: flex; align-items: center; gap: 10px; margin-top: 20px; padding: 12px 16px; background: #fff3e0; border: 1px solid #ffb74d; border-radius: 8px; }
    .term-icon { color: #e65100; }
    .term-text { flex: 1; font-size: 13px; color: #e65100; font-weight: 500; }
    .term-notify-btn { flex-shrink: 0; }
    .history-section { margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(0,0,0,0.1); }
    .history-title { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: rgba(0,0,0,0.54); text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 14px; }
    .history-icon { font-size: 18px; width: 18px; height: 18px; }
    .history-list { display: flex; flex-direction: column; gap: 8px; }
    .history-entry { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #f5f5f5; border-radius: 8px; border-left: 3px solid #bdbdbd; }
    .entry-icon { font-size: 18px; width: 18px; height: 18px; color: #9e9e9e; flex-shrink: 0; }
    .entry-dates { font-size: 14px; font-weight: 500; color: rgba(0,0,0,0.7); }
    .entry-arrow { margin: 0 6px; color: rgba(0,0,0,0.38); }
    .entry-duration { font-size: 12px; color: rgba(0,0,0,0.45); margin-left: 4px; }
  `]
})
export class EmployeeDetailComponent implements OnInit {
  private service = inject(EmployeesService);
  private ordersService = inject(EnforcementOrdersService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private notifications = inject(NotificationService);
  private translate = inject(TranslateService);
  authService = inject(AuthService);

  employee = signal<Employee | null>(null);
  salaryHistory = signal<SalaryHistory[]>([]);
  orders = signal<EnforcementOrder[]>([]);

  loadingSalary = signal(false);
  private salaryPage = 1;
  private salaryTotalPages = signal(1);
  private salaryLoaded = false;
  salaryHasMore = computed(() => this.salaryPage <= this.salaryTotalPages());

  companyId!: number;
  employeeId!: number;

  salaryColumns = ['month', 'netSalary', 'deduction', 'net', 'notes', 'recordedBy', 'paymentOrder'];
  orderColumns = ['orderNumber', 'executor', 'receivedDate', 'total', 'remaining', 'status', 'actions'];

  ngOnInit(): void {
    this.companyId = +(
      this.route.snapshot.paramMap.get('companyId') ??
      this.route.parent?.snapshot.paramMap.get('companyId') ??
      this.route.snapshot.parent?.paramMap.get('companyId') ?? '0'
    );
    this.employeeId = +this.route.snapshot.paramMap.get('employeeId')!;
    this.load();
  }

  load(): void {
    this.service.getById(this.companyId, this.employeeId).subscribe(e => this.employee.set(e));
    this.ordersService.getByEmployee(this.companyId, this.employeeId).subscribe(o => this.orders.set(o));
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 1 && !this.salaryLoaded) {
      this.loadSalaryPage();
    }
  }

  loadSalaryPage(): void {
    if (this.loadingSalary()) return;
    this.loadingSalary.set(true);
    this.service.getSalaryHistory(this.companyId, this.employeeId, this.salaryPage).subscribe({
      next: result => {
        this.salaryHistory.update(h => [...h, ...result.items]);
        this.salaryTotalPages.set(result.totalPages);
        this.salaryPage++;
        this.salaryLoaded = true;
        this.loadingSalary.set(false);
      },
      error: () => this.loadingSalary.set(false)
    });
  }

  loadMoreSalary(): void {
    this.loadSalaryPage();
  }

  downloadPaymentOrder(salaryRecordId: number, overflow: boolean): void {
    this.service.downloadPaymentOrder(salaryRecordId, overflow).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nalog-${salaryRecordId}${overflow ? '-2' : ''}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  durationLabel(h: EmploymentHistory): string {
    const start = new Date(h.startDate);
    const end = new Date(h.endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (months < 1) return '< 1 month';
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0 ? `${years}y ${rem}m` : `${years} year${years !== 1 ? 's' : ''}`;
  }

  deductionClass(s: SalaryHistory): string {
    if (s.isFirstPayment) return 'ded-green';
    if (s.remainingAfterDeduction !== null && s.remainingAfterDeduction <= 0) return 'ded-red';
    if (s.remainingAfterDeduction !== null && s.remainingAfterDeduction < 10000) return 'ded-orange';
    return 'ded-default';
  }

  openRecordSalary(): void {
    this.dialog.open(RecordSalaryDialogComponent, {
      width: '480px',
      data: { companyId: this.companyId, employeeId: this.employeeId, netSalary: this.employee()?.netSalary }
    }).afterClosed().subscribe(saved => {
      if (saved) {
        this.notifications.success(this.translate.instant('salary.successRecorded'));
        this.resetAndReloadSalary();
        this.ordersService.getByEmployee(this.companyId, this.employeeId).subscribe(o => this.orders.set(o));
      }
    });
  }

  private resetAndReloadSalary(): void {
    this.salaryHistory.set([]);
    this.salaryPage = 1;
    this.salaryLoaded = false;
    this.salaryTotalPages.set(1);
    this.loadSalaryPage();
  }

  openAddExecutor(): void {
    this.dialog.open(ExecutorDialogComponent, { width: '520px', maxWidth: '95vw' })
      .afterClosed().subscribe(saved => {
        if (saved) this.notifications.success(this.translate.instant('executors.add'));
      });
  }

  openNewOrder(): void {
    this.dialog.open(OrderFormDialogComponent, {
      width: '560px',
      data: { companyId: this.companyId, employeeId: this.employeeId, netSalary: this.employee()?.netSalary }
    }).afterClosed().subscribe((orderId: number | undefined) => {
      if (orderId) {
        this.load();
        this.dialog.open(EmailPreviewDialogComponent, {
          width: '640px',
          maxWidth: '95vw',
          data: { companyId: this.companyId, employeeId: this.employeeId, orderId }
        });
      }
    });
  }

  openEmailPreview(order: EnforcementOrder): void {
    this.dialog.open(EmailPreviewDialogComponent, {
      width: '640px',
      maxWidth: '95vw',
      data: { companyId: this.companyId, employeeId: this.employeeId, orderId: order.id }
    });
  }

  deleteOrder(order: EnforcementOrder): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Избриши налог',
        message: `Дали си сигурен дека сакаш да го избришеш извршното решение „${order.orderNumber}"? Оваа акција не може да се поврати.`,
        confirmText: 'Избриши',
        cancelText: 'Откажи',
        warn: true
      }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.ordersService.deleteOrder(this.companyId, this.employeeId, order.id).subscribe({
        next: () => {
          this.notifications.success('Налогот е успешно избришан.');
          this.load();
        },
        error: () => this.notifications.error('Грешка при бришење на налогот.')
      });
    });
  }

  openTerminationEmails(): void {
    this.dialog.open(TerminationEmailsDialogComponent, {
      width: '660px',
      maxWidth: '96vw',
      data: { companyId: this.companyId, employeeId: this.employeeId }
    });
  }

  exportEmployee(type: 'pdf' | 'excel'): void {
    const obs = type === 'pdf'
      ? this.service.exportPdf(this.companyId, this.employeeId)
      : this.service.exportExcel(this.companyId, this.employeeId);
    const ext = type === 'pdf' ? 'pdf' : 'xlsx';
    obs.subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employee-${this.employeeId}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
