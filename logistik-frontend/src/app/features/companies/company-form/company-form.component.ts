import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompaniesService } from '../companies.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSlideToggleModule,
    MatProgressSpinnerModule, PageHeaderComponent, TranslateModule
  ],
  template: `
    <app-page-header [title]="(isEdit ? 'companies.editCompany' : 'companies.newCompany') | translate">
      <button mat-stroked-button routerLink="/companies">
        <mat-icon>arrow_back</mat-icon>
        {{ 'common.back' | translate }}
      </button>
    </app-page-header>

    <mat-card class="form-card">
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'companies.companyName' | translate }}</mat-label>
              <input matInput formControlName="name" />
              @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                <mat-error>{{ 'companies.nameRequired' | translate }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'companies.taxNumber' | translate }}</mat-label>
              <input matInput formControlName="taxNumber" maxlength="13" inputmode="numeric" />
              @if (form.get('taxNumber')?.hasError('required') && form.get('taxNumber')?.touched) {
                <mat-error>{{ 'companies.taxRequired' | translate }}</mat-error>
              }
              @if (form.get('taxNumber')?.hasError('pattern') && form.get('taxNumber')?.touched) {
                <mat-error>{{ 'companies.tax13' | translate }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'companies.registrationNumber' | translate }}</mat-label>
              <input matInput formControlName="registrationNumber" maxlength="7" inputmode="numeric" />
              @if (form.get('registrationNumber')?.hasError('required') && form.get('registrationNumber')?.touched) {
                <mat-error>{{ 'companies.regRequired' | translate }}</mat-error>
              }
              @if (form.get('registrationNumber')?.hasError('pattern') && form.get('registrationNumber')?.touched) {
                <mat-error>{{ 'companies.reg7' | translate }}</mat-error>
              }
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'companies.address' | translate }}</mat-label>
            <textarea matInput formControlName="headquartersAddress" rows="2"></textarea>
            @if (form.get('headquartersAddress')?.hasError('required') && form.get('headquartersAddress')?.touched) {
              <mat-error>{{ 'companies.addressRequired' | translate }}</mat-error>
            }
          </mat-form-field>

          @if (isEdit) {
            <mat-slide-toggle formControlName="isActive" color="primary">
              {{ 'common.active' | translate }}
            </mat-slide-toggle>
          }

          <div class="form-actions mt-lg">
            <button mat-stroked-button type="button" routerLink="/companies">{{ 'common.cancel' | translate }}</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="saving()">
              @if (saving()) { <mat-spinner diameter="18" /> }
              {{ (isEdit ? 'common.saveChanges' : 'companies.createCompany') | translate }}
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
export class CompanyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(CompaniesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notifications = inject(NotificationService);
  private translate = inject(TranslateService);

  isEdit = false;
  companyId: number | null = null;
  saving = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    taxNumber: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
    registrationNumber: ['', [Validators.required, Validators.pattern(/^\d{7}$/)]],
    headquartersAddress: ['', Validators.required],
    isActive: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('companyId');
    if (id) {
      this.isEdit = true;
      this.companyId = +id;
      this.service.getById(this.companyId).subscribe(company => {
        this.form.patchValue(company);
      });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving.set(true);
    const value = this.form.value;

    const onSuccess = () => {
      this.notifications.success(this.isEdit
        ? this.translate.instant('companies.editCompany')
        : this.translate.instant('companies.createCompany'));
      this.router.navigate(['/companies'], {
        state: { selectedCompanyId: this.companyId ?? undefined }
      });
    };
    const onError = (err: any) => {
      this.saving.set(false);
      this.notifications.error(err.error?.message ?? this.translate.instant('errors.failedToLoad'));
    };
    if (this.isEdit) {
      this.service.update(this.companyId!, value as any).subscribe({ next: onSuccess, error: onError });
    } else {
      this.service.create(value as any).subscribe({ next: onSuccess, error: onError });
    }
  }
}
