import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { timeout, catchError } from 'rxjs/operators';
import { interval, Subscription, of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { EmployeesService } from '../employees.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TerminationEmailsDialogComponent } from '../termination-emails-dialog/termination-emails-dialog.component';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatDatepickerModule,
    MatNativeDateModule, MatProgressSpinnerModule,
    MatDialogModule, PageHeaderComponent, TranslateModule
  ],
  template: `
    <app-page-header [title]="(isEdit ? 'employees.editEmployee' : 'employees.newEmployee') | translate">
      <button mat-stroked-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
        {{ 'common.back' | translate }}
      </button>
    </app-page-header>

    <mat-card class="form-card">
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-row">
            @if (!isEdit) {
              <mat-form-field appearance="outline" style="max-width:160px">
                <mat-label>{{ 'employees.code' | translate }}</mat-label>
                <input matInput formControlName="code" />
              </mat-form-field>
            }

            <mat-form-field appearance="outline">
              <mat-label>{{ 'employees.fullName' | translate }}</mat-label>
              <input matInput formControlName="fullName" />
              @if (form.get('fullName')?.hasError('required') && form.get('fullName')?.touched) {
                <mat-error>{{ 'employees.fullNameRequired' | translate }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'employees.embg' | translate }}</mat-label>
              <input matInput formControlName="embg" maxlength="13" />
              @if (form.get('embg')?.hasError('required') && form.get('embg')?.touched) {
                <mat-error>{{ 'employees.embgRequired' | translate }}</mat-error>
              }
              @if (form.get('embg')?.hasError('minlength') && form.get('embg')?.touched) {
                <mat-error>{{ 'employees.embg13digits' | translate }}</mat-error>
              }
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'employees.employmentStartDate' | translate }}</mat-label>
              <input matInput [matDatepicker]="startPicker" formControlName="employmentStartDate" />
              <mat-datepicker-toggle matIconSuffix [for]="startPicker" />
              <mat-datepicker #startPicker />
            </mat-form-field>

            @if (isEdit) {
              <mat-form-field appearance="outline">
                <mat-label>{{ 'employees.employmentEndDate' | translate }}</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="employmentEndDate" />
                <mat-datepicker-toggle matIconSuffix [for]="endPicker" />
                <mat-datepicker #endPicker />
              </mat-form-field>
            }
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'employees.bankAccount' | translate }}</mat-label>
              <input matInput formControlName="bankAccount" />
              @if (form.get('bankAccount')?.hasError('required') && form.get('bankAccount')?.touched) {
                <mat-error>{{ 'employees.bankAccountRequired' | translate }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'employees.netSalary' | translate }}</mat-label>
              <input matInput type="number" formControlName="netSalary" min="0" />
              @if (form.get('netSalary')?.hasError('required') && form.get('netSalary')?.touched) {
                <mat-error>{{ 'employees.netSalaryRequired' | translate }}</mat-error>
              }
            </mat-form-field>
          </div>

          <div class="form-actions mt-lg">
            <button mat-stroked-button type="button" (click)="goBack()">{{ 'common.cancel' | translate }}</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="saving()">
              @if (saving()) { <mat-spinner diameter="18" /> }
              @if (!saving()) { {{ (isEdit ? 'common.saveChanges' : 'employees.addEmployee') | translate }} }
              @if (saving()) { {{ savingMsg() }} }
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-card { max-width: 800px; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
    mat-spinner { margin-right: 8px; display: inline-block; }
  `]
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private service = inject(EmployeesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notifications = inject(NotificationService);
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);

  isEdit = false;
  companyId!: number;
  employeeId: number | null = null;
  saving = signal(false);
  savingMsg = signal('Зачувувам...');
  private hadEndDateOnLoad = false;
  private keepAliveSub?: Subscription;
  private savingTimerSub?: Subscription;

  form = this.fb.group({
    code: [null as string | null],
    fullName: ['', Validators.required],
    embg: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
    employmentStartDate: [null as Date | null, Validators.required],
    employmentEndDate: [null as Date | null],
    bankAccount: ['', Validators.required],
    netSalary: [null as number | null, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    // companyId lives in the parent route (:companyId/employees), not in this child route
    this.companyId = +(
      this.route.snapshot.paramMap.get('companyId') ??
      this.route.parent?.snapshot.paramMap.get('companyId') ??
      this.route.snapshot.parent?.paramMap.get('companyId') ?? '0'
    );
    const id = this.route.snapshot.paramMap.get('employeeId');
    if (id) {
      this.isEdit = true;
      this.employeeId = +id;
      this.service.getById(this.companyId, this.employeeId).subscribe(e => {
        this.hadEndDateOnLoad = !!e.employmentEndDate;
        this.form.patchValue({
          ...e,
          employmentStartDate: e.employmentStartDate ? new Date(e.employmentStartDate) : null,
          employmentEndDate: e.employmentEndDate ? new Date(e.employmentEndDate) : null
        });
      });
    }

    // Keep Railway warm: ping /health every 60 s while the form is open
    this.keepAliveSub = interval(60_000).subscribe(() => {
      this.http.get(`${environment.apiUrl.replace('/api', '')}/health`, { responseType: 'text' })
        .pipe(catchError(() => of(null)))
        .subscribe();
    });
  }

  ngOnDestroy(): void {
    this.keepAliveSub?.unsubscribe();
    this.savingTimerSub?.unsubscribe();
  }

  goBack(): void {
    this.router.navigate(['/companies'], { state: { selectedCompanyId: this.companyId } });
  }

  submit(transferFromEmployeeId?: number): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving.set(true);
    const v = this.form.value;

    const toDateOnly = (d: Date | null | undefined): string => {
      if (!d) return '';
      if (!(d instanceof Date)) return d;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const payload = {
      fullName: v.fullName!,
      embg: v.embg!,
      employmentStartDate: toDateOnly(v.employmentStartDate),
      employmentEndDate: v.employmentEndDate ? toDateOnly(v.employmentEndDate) : null,
      bankAccount: v.bankAccount!,
      netSalary: v.netSalary!,
      ...(!this.isEdit && v.code ? { code: v.code } : {}),
      ...(transferFromEmployeeId ? { transferFromEmployeeId } : {})
    };

    const endDateNewlySet = this.isEdit && !this.hadEndDateOnLoad && !!payload.employmentEndDate;
    const savedEmpId = this.employeeId;
    const savedCompanyId = this.companyId;

    const onSuccess = () => {
      this.saving.set(false);
      this.savingMsg.set('Зачувувам...');
      this.savingTimerSub?.unsubscribe();
      this.notifications.success(this.isEdit
        ? this.translate.instant('employees.editEmployee')
        : this.translate.instant('employees.addEmployee'));

      if (endDateNewlySet && savedEmpId) {
        // Navigate first, then open dialog once we know there are emails
        this.goBack();
        this.service.getTerminationEmails(savedCompanyId, savedEmpId).subscribe({
          next: emails => {
            if (emails.length > 0) {
              this.dialog.open(TerminationEmailsDialogComponent, {
                width: '660px',
                maxWidth: '96vw',
                data: { companyId: savedCompanyId, employeeId: savedEmpId }
              });
            }
          },
          error: () => { /* silently ignore — user already navigated back */ }
        });
      } else {
        this.goBack();
      }
    };

    const onError = (err: any) => {
      this.saving.set(false);
      this.savingMsg.set('Зачувувам...');
      this.savingTimerSub?.unsubscribe();
      // TimeoutError — API did not respond within 2 minutes
      if (err?.name === 'TimeoutError') {
        this.notifications.error('Серверот не одговори по 2 минути. Обидете се повторно.');
        return;
      }
      const msg: string = err.error?.message ?? '';

      if (msg.startsWith('TERMINATED:')) {
        // Format: TERMINATED:{id}:{endDate}:{fullName}
        const parts = msg.split(':');
        const terminatedId = parseInt(parts[1]);
        const endDate = parts[2];
        const fullName = parts.slice(3).join(':');

        this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Претходно вработен',
            message: `„${fullName}" со овој ЕМБГ бил претходно вработен и одјавен на ${endDate}.\n\nДали сакате да го вратите на работа? Постојните извршни решенија ќе се пренесат на новиот работен период.`,
            confirmText: 'Врати на работа',
            warn: false
          }
        }).afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.submit(terminatedId);
          }
        });
        return;
      }

      if (msg === 'EMBG_ACTIVE') {
        this.notifications.error('Вработен со овој ЕМБГ веќе постои и е активен.');
        return;
      }

      this.notifications.error(msg || this.translate.instant('errors.failedToLoad'));
    };

    // Show progressively more helpful messages while waiting for slow Railway cold-starts
    this.savingMsg.set('Зачувувам...');
    this.savingTimerSub = interval(10_000).subscribe(tick => {
      if (tick === 0) this.savingMsg.set('Серверот се стартува...');
      if (tick === 3) this.savingMsg.set('Уште малку...');
      if (tick >= 6) this.savingTimerSub?.unsubscribe();
    });

    if (this.isEdit) {
      this.service.update(this.companyId, this.employeeId!, payload)
        .pipe(timeout(120_000))
        .subscribe({ next: onSuccess, error: onError });
    } else {
      this.service.create(this.companyId, payload)
        .pipe(timeout(120_000))
        .subscribe({ next: () => onSuccess(), error: onError });
    }
  }
}
