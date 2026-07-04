import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EnforcementOrdersService } from '../enforcement-orders.service';
import { ExecutorsService, Executor } from '../executors.service';
import { NotificationService } from '../../../core/services/notification.service';

interface DialogData {
  companyId: number;
  employeeId: number;
  netSalary: number;
}

@Component({
  selector: 'app-order-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatDatepickerModule, MatProgressSpinnerModule, MatIconModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ 'orders.newOrder' | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <div class="form-row-2">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'orders.orderNumber' | translate }}</mat-label>
            <input matInput formControlName="orderNumber" />
            @if (form.get('orderNumber')?.hasError('required') && form.get('orderNumber')?.touched) {
              <mat-error>{{ 'orders.orderNumberRequired' | translate }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'orders.receivedDate' | translate }}</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="receivedDate" />
            <mat-datepicker-toggle matIconSuffix [for]="picker" />
            <mat-datepicker #picker />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'orders.executorLabel' | translate }}</mat-label>
          <mat-select formControlName="executorId" (selectionChange)="onExecutorSelected($event.value)">
            @for (ex of executors(); track ex.id) {
              <mat-option [value]="ex.id">{{ ex.name }}</mat-option>
            }
          </mat-select>
          @if (form.get('executorId')?.hasError('required') && form.get('executorId')?.touched) {
            <mat-error>{{ 'orders.executorRequired' | translate }}</mat-error>
          }
          @if (executors().length === 0 && !loadingExecutors()) {
            <mat-hint class="hint-warn">{{ 'orders.noExecutorsYet' | translate }}</mat-hint>
          }
        </mat-form-field>

        @if (selectedExecutor()) {
          <div class="executor-card">
            <div class="executor-row">
              <mat-icon class="executor-icon">person</mat-icon>
              <div>
                <div class="executor-name">{{ selectedExecutor()!.name }}</div>
                <div class="executor-detail">{{ selectedExecutor()!.email }}</div>
                <div class="executor-detail">{{ selectedExecutor()!.bankAccount }}</div>
              </div>
            </div>
          </div>
        }

        <div class="form-row-2">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'orders.totalAmountLabel' | translate }}</mat-label>
            <input matInput type="number" formControlName="totalAmount" />
            @if (form.get('totalAmount')?.hasError('required') && form.get('totalAmount')?.touched) {
              <mat-error>{{ 'orders.totalAmountRequired' | translate }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Месечна задршка (МКД)</mat-label>
            <input matInput type="number" formControlName="monthlyDeduction" min="1" />
            <mat-hint>Остави празно за автоматски 1/5 = {{ data.netSalary / 5 | number:'1.0-0' }} ден.</mat-hint>
            @if (form.get('monthlyDeduction')?.hasError('min') && form.get('monthlyDeduction')?.touched) {
              <mat-error>Задршката мора да биде > 0</mat-error>
            }
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="submit()" [disabled]="saving || loadingExecutors() || !canSubmit()">
        @if (saving) { <mat-spinner diameter="18" /> }
        {{ 'orders.createOrder' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form { display: flex; flex-direction: column; gap: 8px; padding: 8px 0; min-width: min(480px, 82vw); }
    .full-width { width: 100%; }
    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 600px) {
      .form-row-2 { grid-template-columns: 1fr; }
    }
    .executor-card {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 10px 14px;
      margin: -4px 0 4px;
    }
    .executor-row { display: flex; align-items: flex-start; gap: 10px; }
    .executor-icon { color: #3949ab; margin-top: 2px; }
    .executor-name { font-size: 14px; font-weight: 500; }
    .executor-detail { font-size: 12px; color: rgba(0,0,0,0.54); margin-top: 2px; }
    .hint-warn { color: #e53935; }
    mat-spinner { margin-right: 8px; display: inline-block; }
  `]
})
export class OrderFormDialogComponent implements OnInit {
  data = inject<DialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<OrderFormDialogComponent>);
  private service = inject(EnforcementOrdersService);
  private executorsService = inject(ExecutorsService);
  private notifications = inject(NotificationService);
  private translate = inject(TranslateService);
  private fb = inject(FormBuilder);

  saving = false;
  loadingExecutors = signal(true);
  executors = signal<Executor[]>([]);
  selectedExecutor = signal<Executor | null>(null);

  form = this.fb.group({
    orderNumber: ['', Validators.required],
    receivedDate: [new Date(), Validators.required],
    executorId: [null as number | null, Validators.required],
    totalAmount: [null as number | null, [Validators.required, Validators.min(1)]],
    monthlyDeduction: [null as number | null, [Validators.min(1)]]
  });

  ngOnInit(): void {
    this.executorsService.getAll().subscribe({
      next: list => { this.executors.set(list); this.loadingExecutors.set(false); },
      error: () => this.loadingExecutors.set(false)
    });
  }

  canSubmit(): boolean {
    const v = this.form.value;
    return !!(v.orderNumber?.trim()) && !!(v.executorId) && !!(v.totalAmount && v.totalAmount > 0);
  }

  onExecutorSelected(id: number): void {
    const ex = this.executors().find(e => e.id === id) ?? null;
    this.selectedExecutor.set(ex);
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const executor = this.selectedExecutor();
    if (!executor) return;

    this.saving = true;
    const v = this.form.value;
    const d = v.receivedDate as Date;
    const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');

    this.service.create(this.data.companyId, this.data.employeeId, {
      orderNumber: v.orderNumber!,
      executorName: executor.name,
      executorEmail: executor.email,
      executorBankAccount: executor.bankAccount,
      totalAmount: v.totalAmount!,
      monthlyDeduction: v.monthlyDeduction ?? undefined,
      receivedDate: `${y}-${m}-${day}`
    }).subscribe({
      next: (res: { id: number }) => { this.saving = false; this.dialogRef.close(res.id); },
      error: (err: any) => {
        this.saving = false;
        if (err.status < 500) this.notifications.error(err.error?.message || this.translate.instant('errors.failedToLoad'));
      }
    });
  }
}
