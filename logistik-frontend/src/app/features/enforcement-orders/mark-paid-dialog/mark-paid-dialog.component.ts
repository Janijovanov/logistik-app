import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EnforcementOrdersService } from '../enforcement-orders.service';
import { EnforcementOrder } from '../../../core/models/enforcement-order.models';
import { CurrencyMkPipe } from '../../../shared/pipes/currency-mk.pipe';

interface DialogData {
  companyId: number;
  employeeId: number;
  order: EnforcementOrder;
}

@Component({
  selector: 'app-mark-paid-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule, CurrencyMkPipe, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'orders.markOrderPaid' | translate }}</h2>
    <mat-dialog-content>
      <div class="confirm-content">
        <mat-icon class="confirm-icon">check_circle</mat-icon>
        <p>{{ 'orders.markPaidConfirm' | translate: {orderNumber: data.order.orderNumber} }}</p>
        <div class="order-summary">
          <div class="summary-row">
            <span>{{ 'orders.executorLabel2' | translate }}</span>
            <strong>{{ data.order.executorName }}</strong>
          </div>
          <div class="summary-row">
            <span>{{ 'orders.totalAmountLabel2' | translate }}</span>
            <strong>{{ data.order.totalAmount | currencyMk }}</strong>
          </div>
          <div class="summary-row">
            <span>{{ 'orders.remainingLabel' | translate }}</span>
            <strong>{{ data.order.remainingAmount | currencyMk }}</strong>
          </div>
        </div>
        <p class="warning-text">
          {{ 'orders.markPaidWarning' | translate }}
        </p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="confirm()" [disabled]="saving">
        @if (saving) { <mat-spinner diameter="18" /> }
        {{ 'common.confirm' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .confirm-content { text-align: center; padding: 8px 0; min-width: 360px; }
    .confirm-icon { font-size: 48px; width: 48px; height: 48px; color: #388e3c; margin-bottom: 12px; }
    .order-summary {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 16px 0;
      text-align: left;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 14px;
    }
    .warning-text { font-size: 13px; color: rgba(0,0,0,0.54); }
    mat-spinner { margin-right: 8px; display: inline-block; }
  `]
})
export class MarkPaidDialogComponent {
  data = inject<DialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<MarkPaidDialogComponent>);
  private service = inject(EnforcementOrdersService);

  saving = false;

  confirm(): void {
    this.saving = true;
    this.service.markPaid(this.data.companyId, this.data.employeeId, this.data.order.id).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => {
        this.saving = false;
        alert(err.error?.message ?? 'Failed to mark order as paid.');
      }
    });
  }
}
