import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeesService } from '../employees.service';
import { EmployeeMonthlySalary } from '../../../core/models/employee.models';

interface DialogData {
  companyId: number;
  employee: EmployeeMonthlySalary;
}

@Component({
  selector: 'app-rehire-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatDatepickerModule, MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon class="title-icon">person_add</mat-icon>
      Врати на работа
    </h2>

    <mat-dialog-content>
      <div class="employee-banner">
        <mat-icon>person</mat-icon>
        <div>
          <div class="emp-name">{{ data.employee.fullName }}</div>
          <div class="emp-meta">ЕМБГ: {{ data.employee.embg }}</div>
          <div class="emp-meta end-date">
            Одјавен: {{ data.employee.employmentEndDate | date:'dd.MM.yyyy' }}
          </div>
        </div>
      </div>

      <p class="info-text">
        Внеси нов датум на вработување. Постојните извршни решенија ќе се пренесат
        на новиот работен период.
      </p>

      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Нов датум на вработување</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="startDate" readonly (click)="picker.open()" />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker />
          @if (form.get('startDate')?.hasError('required') && form.get('startDate')?.touched) {
            <mat-error>Датумот е задолжителен</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Нето плата (МКД)</mat-label>
          <input matInput type="number" formControlName="netSalary" min="0" />
          @if (form.get('netSalary')?.hasError('required') && form.get('netSalary')?.touched) {
            <mat-error>Платата е задолжителна</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Банкарска сметка</mat-label>
          <input matInput formControlName="bankAccount" />
          @if (form.get('bankAccount')?.hasError('required') && form.get('bankAccount')?.touched) {
            <mat-error>Банкарската сметка е задолжителна</mat-error>
          }
        </mat-form-field>
      </form>

      @if (errorMsg()) {
        <div class="error-feedback">
          <mat-icon>error</mat-icon>
          <span>{{ errorMsg() }}</span>
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close [disabled]="saving()">Откажи</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="saving()">
        @if (saving()) { <mat-spinner diameter="18" style="display:inline-block;margin-right:6px" /> }
        <mat-icon>how_to_reg</mat-icon>
        Врати на работа
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title { display: flex; align-items: center; gap: 8px; }
    .title-icon { color: #2e7d32; }
    mat-dialog-content { width: 420px; max-width: 95vw; }

    .employee-banner {
      display: flex; align-items: flex-start; gap: 12px;
      background: #fff8e1; border: 1px solid #ffb74d;
      border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;
    }
    .employee-banner mat-icon { color: #e65100; margin-top: 2px; }
    .emp-name { font-weight: 600; font-size: 15px; }
    .emp-meta { font-size: 12px; color: rgba(0,0,0,0.55); margin-top: 2px; }
    .end-date { color: #c62828; }

    .info-text { font-size: 13px; color: rgba(0,0,0,0.6); margin: 0 0 16px; line-height: 1.5; }

    .full-width { width: 100%; margin-bottom: 4px; }

    .error-feedback {
      display: flex; align-items: center; gap: 8px;
      background: #ffebee; color: #c62828; padding: 10px 14px;
      border-radius: 8px; font-size: 13px; margin-top: 8px;
    }
    .error-feedback mat-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class RehireDialogComponent {
  data = inject<DialogData>(MAT_DIALOG_DATA);
  private service = inject(EmployeesService);
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<RehireDialogComponent>);

  saving = signal(false);
  errorMsg = signal<string | null>(null);

  form = this.fb.group({
    startDate: [null as Date | null, Validators.required],
    netSalary: [this.data.employee.netSalary, [Validators.required, Validators.min(0)]],
    bankAccount: [this.data.employee.bankAccount, Validators.required]
  });

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving.set(true);
    this.errorMsg.set(null);

    const v = this.form.value;
    const d = v.startDate as Date;
    const startDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const emp = this.data.employee;
    const payload = {
      fullName: emp.fullName,
      embg: emp.embg,
      employmentStartDate: startDate,
      employmentEndDate: null,
      bankAccount: v.bankAccount!,
      netSalary: v.netSalary!
    };

    // Step 1: Try to create (will return TERMINATED error with the employee ID)
    this.service.create(this.data.companyId, payload).subscribe({
      next: () => {
        // Shouldn't happen if employee is terminated, but handle anyway
        this.saving.set(false);
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        const msg: string = err.error?.message ?? '';
        if (msg.startsWith('TERMINATED:')) {
          const terminatedId = parseInt(msg.split(':')[1]);
          // Step 2: Confirm re-hire by passing transferFromEmployeeId
          this.service.create(this.data.companyId, { ...payload, transferFromEmployeeId: terminatedId }).subscribe({
            next: () => {
              this.saving.set(false);
              this.dialogRef.close(true);
            },
            error: (e2: any) => {
              this.saving.set(false);
              this.errorMsg.set(e2.error?.message ?? 'Грешка при враќање на работа.');
            }
          });
        } else {
          this.saving.set(false);
          this.errorMsg.set(msg || 'Грешка при враќање на работа.');
        }
      }
    });
  }
}
