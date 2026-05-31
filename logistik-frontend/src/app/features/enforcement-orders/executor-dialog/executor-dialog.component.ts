import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ExecutorsService, Executor } from '../executors.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-executor-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatDividerModule, MatTooltipModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ 'executors.manage' | translate }}</h2>
    <mat-dialog-content class="dialog-content">

      <!-- Existing executors list -->
      @if (loading()) {
        <div class="list-loading"><mat-spinner diameter="28" /></div>
      } @else if (executors().length > 0) {
        <div class="executor-list">
          @for (ex of executors(); track ex.id) {
            <div class="executor-item">
              <div class="executor-info">
                <span class="executor-name">{{ ex.name }}</span>
                <span class="executor-sub">{{ ex.email }} · {{ ex.bankAccount }}</span>
              </div>
              <button mat-icon-button color="warn" (click)="deleteExecutor(ex)"
                [disabled]="deletingId() === ex.id"
                [matTooltip]="'executors.deleteTooltip' | translate">
                @if (deletingId() === ex.id) {
                  <mat-spinner diameter="18" />
                } @else {
                  <mat-icon>delete</mat-icon>
                }
              </button>
            </div>
          }
        </div>
      } @else {
        <p class="empty-hint">{{ 'executors.noExecutors' | translate }}</p>
      }

      <mat-divider class="divider" />

      <!-- Add new executor form -->
      <p class="add-title">{{ 'executors.addNew' | translate }}</p>
      <form [formGroup]="form" class="add-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'executors.name' | translate }}</mat-label>
          <input matInput formControlName="name" />
          @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
            <mat-error>{{ 'executors.nameRequired' | translate }}</mat-error>
          }
        </mat-form-field>

        <div class="form-row-2">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'executors.email' | translate }}</mat-label>
            <input matInput type="email" formControlName="email" />
            @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
              <mat-error>{{ 'executors.emailRequired' | translate }}</mat-error>
            }
            @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
              <mat-error>{{ 'executors.emailInvalid' | translate }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'executors.bankAccount' | translate }}</mat-label>
            <input matInput formControlName="bankAccount" />
            @if (form.get('bankAccount')?.hasError('required') && form.get('bankAccount')?.touched) {
              <mat-error>{{ 'executors.bankAccountRequired' | translate }}</mat-error>
            }
          </mat-form-field>
        </div>

        <div class="add-action">
          <button mat-flat-button color="primary" (click)="addExecutor()" [disabled]="saving()">
            @if (saving()) { <mat-spinner diameter="18" /> }
            {{ 'executors.add' | translate }}
          </button>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(changed())">{{ 'common.close' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content { padding: 4px 20px 8px; }
    .list-loading { display: flex; justify-content: center; padding: 24px; }
    .executor-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 192px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 4px;
      margin-bottom: 4px;
    }
    .executor-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 4px 10px 12px;
      border-radius: 6px;
      background: #fafafa;
      flex-shrink: 0;
    }
    .executor-item:hover { background: #f0f0f0; }
    .executor-info { display: flex; flex-direction: column; gap: 2px; }
    .executor-name { font-size: 14px; font-weight: 500; }
    .executor-sub { font-size: 12px; color: rgba(0,0,0,0.54); }
    .empty-hint { color: rgba(0,0,0,0.38); font-size: 14px; text-align: center; padding: 16px 0 8px; }
    .divider { margin: 16px 0 14px; }
    .add-title { font-size: 12px; font-weight: 600; color: rgba(0,0,0,0.5); margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.6px; }
    .add-form { display: flex; flex-direction: column; gap: 4px; width: 100%; }
    .full-width { width: 100%; }
    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; }
    .form-row-2 mat-form-field { width: 100%; }
    .add-action { display: flex; justify-content: flex-end; margin-top: 4px; }
    mat-spinner { margin-right: 8px; display: inline-block; }
  `]
})
export class ExecutorDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<ExecutorDialogComponent>);
  private service = inject(ExecutorsService);
  private notifications = inject(NotificationService);
  private translate = inject(TranslateService);
  private fb = inject(FormBuilder);

  loading = signal(true);
  saving = signal(false);
  deletingId = signal<number | null>(null);
  executors = signal<Executor[]>([]);
  changed = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    bankAccount: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadExecutors();
  }

  private loadExecutors(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: list => { this.executors.set(list); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  addExecutor(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const v = this.form.value;
    this.service.create({ name: v.name!, email: v.email!, bankAccount: v.bankAccount! }).subscribe({
      next: () => {
        this.saving.set(false);
        this.form.reset();
        this.changed.set(true);
        this.loadExecutors();
        this.notifications.success(this.translate.instant('executors.add'));
      },
      error: (err: any) => {
        this.saving.set(false);
        if (err.status < 500) this.notifications.error(err.error?.message || this.translate.instant('errors.failedToLoad'));
      }
    });
  }

  deleteExecutor(ex: Executor): void {
    this.deletingId.set(ex.id);
    this.service.delete(ex.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.changed.set(true);
        this.executors.update(list => list.filter(e => e.id !== ex.id));
      },
      error: (err: any) => {
        this.deletingId.set(null);
        this.notifications.error(err.error?.message || this.translate.instant('errors.failedToLoad'));
      }
    });
  }
}
