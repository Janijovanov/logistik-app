import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmployeesService } from '../employees.service';
import { EnforcementOrdersService } from '../../enforcement-orders/enforcement-orders.service';
import { EnforcementOrder } from '../../../core/models/enforcement-order.models';
import { NotificationService } from '../../../core/services/notification.service';

interface DialogData {
  companyId: number;
  employeeId: number;
  netSalary: number;
  prefilledMonth?: Date;
  // edit mode
  salaryRecordId?: number;
  recordedNetSalary?: number;
}

interface OrderCalc {
  order: EnforcementOrder;
  monthlyDeduction: number;  // 1/5 of the salary entered this month
}

@Component({
  selector: 'app-record-salary-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule,
    MatDividerModule, MatIconModule, TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ (isEditMode ? 'salary.editRecordedSalary' : 'salary.recordMonthlySalary') | translate }}</h2>
    <mat-dialog-content>
      @if (!calc()) {
        <form [formGroup]="form" class="dialog-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'salary.salaryMonth' | translate }}</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="salaryMonth"
              [max]="maxMonth" [readonly]="isEditMode" />
            @if (!isEditMode) {
              <mat-datepicker-toggle matIconSuffix [for]="picker" />
            }
            <mat-datepicker #picker startView="year" (monthSelected)="selectMonth($event, picker)" />
            @if (form.get('salaryMonth')?.hasError('required') && form.get('salaryMonth')?.touched) {
              <mat-error>{{ 'salary.monthRequired' | translate }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'employees.netSalary' | translate }}</mat-label>
            <input matInput type="number" formControlName="netSalary" />
            <mat-hint>{{ 'salary.salaryDefault' | translate: {amount: (data.netSalary | number:'1.0-0')} }}</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'salary.notesOptional' | translate }}</mat-label>
            <textarea matInput formControlName="notes" rows="2"></textarea>
          </mat-form-field>
        </form>
      } @else {
        <div class="summary-panel">
          <div class="success-row">
            <mat-icon class="success-icon">check_circle</mat-icon>
            <span>{{ 'salary.successRecorded' | translate }}</span>
          </div>

          <mat-divider class="divider" />

          <p class="order-title">
            {{ 'salary.activeOrder' | translate }}
            <strong>{{ calc()!.order.orderNumber }}</strong>
          </p>
          <p class="order-sub">{{ 'salary.executor' | translate }} {{ calc()!.order.executorName }}</p>

          <mat-divider class="divider" />

          <div class="calc-grid">
            <div class="calc-row">
              <span class="calc-label">{{ 'salary.totalOrderAmount' | translate }}</span>
              <span class="calc-value">{{ calc()!.order.totalAmount | number:'1.0-0' }} ден.</span>
            </div>
            <div class="calc-row">
              <span class="calc-label">{{ 'salary.totalPaidSoFar' | translate }}</span>
              <span class="calc-value">{{ calc()!.order.totalPaid | number:'1.0-0' }} ден.</span>
            </div>
            <div class="calc-row emphasis">
              <span class="calc-label">{{ 'salary.paymentThisMonth' | translate }}</span>
              <span class="calc-value red">{{ calc()!.monthlyDeduction | number:'1.0-0' }} ден.</span>
            </div>
            <div class="calc-row emphasis total-row">
              <span class="calc-label">{{ 'salary.remainingAfterPayment' | translate }}</span>
              <span class="calc-value" [class.green]="calc()!.order.remainingAmount <= 0" [class.red]="calc()!.order.remainingAmount > 0">
                {{ calc()!.order.remainingAmount | number:'1.0-0' }} ден.
              </span>
            </div>
          </div>

          @if (calc()!.order.remainingAmount <= 0) {
            <div class="done-banner">
              <mat-icon>emoji_events</mat-icon>
              {{ 'salary.orderFullyPaid' | translate }}
            </div>
          }
        </div>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      @if (!calc()) {
        <button mat-button (click)="dialogRef.close(false)">{{ 'common.cancel' | translate }}</button>
        <button mat-flat-button color="primary" (click)="submit()" [disabled]="saving">
          @if (saving) { <mat-spinner diameter="18" /> }
          {{ (isEditMode ? 'salary.saveChanges' : 'salary.record') | translate }}
        </button>
      } @else {
        <button mat-flat-button color="primary" (click)="dialogRef.close(true)">{{ 'salary.close' | translate }}</button>
      }
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
      min-width: 400px;
    }
    .summary-panel { min-width: 400px; padding: 4px 0; }
    .success-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      font-size: 15px;
      font-weight: 500;
    }
    .success-icon { color: #388e3c; font-size: 26px; width: 26px; height: 26px; }
    .divider { margin: 12px 0; }
    .order-title { margin: 0 0 4px; font-size: 14px; }
    .order-sub { margin: 0; font-size: 13px; color: rgba(0,0,0,0.54); }
    .calc-grid { display: flex; flex-direction: column; gap: 10px; padding: 4px 0; }
    .calc-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .calc-row.emphasis {
      background: #f5f5f5;
      padding: 8px 10px;
      border-radius: 6px;
    }
    .calc-row.total-row { margin-top: 2px; }
    .calc-label { font-size: 13px; color: rgba(0,0,0,0.70); }
    .calc-value { font-size: 14px; font-weight: 600; }
    .calc-value.red { color: #e53935; }
    .calc-value.green { color: #388e3c; }
    .done-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #e8f5e9;
      color: #2e7d32;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      margin-top: 16px;
    }
  `]
})
export class RecordSalaryDialogComponent {
  data = inject<DialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<RecordSalaryDialogComponent>);
  private service = inject(EmployeesService);
  private ordersService = inject(EnforcementOrdersService);
  private notifications = inject(NotificationService);
  private translate = inject(TranslateService);
  private fb = inject(FormBuilder);

  saving = false;
  calc = signal<OrderCalc | null>(null);
  maxMonth = new Date();
  isEditMode = !!this.data.salaryRecordId;

  form = this.fb.group({
    salaryMonth: [this.data.prefilledMonth ?? null as Date | null, Validators.required],
    netSalary: [this.data.recordedNetSalary ?? this.data.netSalary, Validators.required],
    notes: ['']
  });

  selectMonth(date: Date, picker: any): void {
    this.form.patchValue({ salaryMonth: new Date(date.getFullYear(), date.getMonth(), 1) });
    picker.close();
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving = true;
    const v = this.form.value;
    const netSalary = v.netSalary ?? this.data.netSalary;
    const notes = v.notes ?? undefined;

    if (this.isEditMode) {
      this.service.updateSalary(
        this.data.companyId, this.data.employeeId, this.data.salaryRecordId!,
        { netSalary, notes }
      ).subscribe({
        next: () => { this.saving = false; this.dialogRef.close(true); },
        error: (err: any) => {
          this.saving = false;
          if (err.status < 500) this.notifications.error(err.error?.message || this.translate.instant('errors.failedToLoad'));
        }
      });
      return;
    }

    const d = v.salaryMonth as Date;
    const salaryDateOnly = new Date(d.getFullYear(), d.getMonth(), 1);

    this.service.recordSalary(this.data.companyId, this.data.employeeId, {
      salaryMonth: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`,
      netSalary,
      notes
    }).subscribe({
      next: () => {
        this.ordersService.getByEmployee(this.data.companyId, this.data.employeeId).subscribe({
          next: (orders) => {
            const active = orders.find(o => ['Active', 'LastInstallment', 'Final'].includes(o.status));
            if (active) {
              // Only show deduction summary when the salary month is on or after the order's received date.
              // Otherwise the backend applied no deduction (order wasn't effective yet for this month).
              const parts = active.receivedDate.split('-').map(Number);
              const orderDateOnly = new Date(parts[0], parts[1] - 1, parts[2]);
              if (salaryDateOnly >= orderDateOnly) {
                // If monthlyDeduction is null (auto mode), compute 1/5 from the salary entered this month
                const effectiveDeduction = active.monthlyDeduction ?? Math.round(netSalary / 5 * 100) / 100;
                this.calc.set({ order: active, monthlyDeduction: effectiveDeduction });
              } else {
                this.dialogRef.close(true);
              }
            } else {
              this.dialogRef.close(true);
            }
            this.saving = false;
          },
          error: () => { this.saving = false; this.dialogRef.close(true); }
        });
      },
      error: (err: any) => {
        this.saving = false;
        const msg: string = err.error?.message ?? '';
        if (msg.toLowerCase().includes('already recorded')) {
          this.notifications.error(this.translate.instant('errors.failedToLoad'));
          this.dialogRef.close(true);
        } else if (err.status < 500) {
          this.notifications.error(msg || this.translate.instant('errors.failedToLoad'));
        }
      }
    });
  }
}
