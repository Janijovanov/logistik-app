import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WorkTimeService } from '../work-time.service';
import { NotificationService } from '../../../core/services/notification.service';
import { WorkTimeCompanyDto, WorkDocumentTypeDto, WorkTimeUserDto } from '../../../core/models/work-time.models';

@Component({
  selector: 'app-work-time-manager-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
    MatDialogModule, MatListModule, MatTooltipModule, MatCheckboxModule, TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>
      {{ (data.type === 'companies' ? 'workTime.manageCompanies' : 'workTime.manageDocTypes') | translate }}
    </h2>
    <mat-dialog-content>
      <!-- Add new -->
      <div class="add-row">
        <mat-form-field appearance="outline" class="name-field">
          <mat-label>{{ 'common.name' | translate }}</mat-label>
          <input matInput [(ngModel)]="newName" (keyup.enter)="add()" />
        </mat-form-field>
        <button mat-flat-button color="primary" (click)="add()" [disabled]="!newName.trim()">
          <mat-icon>add</mat-icon>
          {{ 'common.add' | translate }}
        </button>
      </div>

      <!-- List -->
      <div class="items-list">
        @for (item of items(); track item.id) {
          <div class="item-row">
            @if (editingId === item.id) {
              <mat-form-field appearance="outline" class="edit-field">
                <input matInput [(ngModel)]="editName" (keyup.enter)="saveEdit(item.id)" />
              </mat-form-field>
              <button mat-icon-button color="primary" (click)="saveEdit(item.id)"
                [matTooltip]="'common.save' | translate">
                <mat-icon>check</mat-icon>
              </button>
              <button mat-icon-button (click)="cancelEdit()"
                [matTooltip]="'common.cancel' | translate">
                <mat-icon>close</mat-icon>
              </button>
            } @else {
              <span class="item-name">{{ item.name }}</span>
              @if (data.type === 'companies') {
                <button mat-icon-button (click)="toggleWorkers(item.id)"
                  [color]="expandedCompanyId === item.id ? 'primary' : ''"
                  [matTooltip]="'workTime.assignWorkers' | translate">
                  <mat-icon>group</mat-icon>
                </button>
              }
              <button mat-icon-button (click)="startEdit(item)"
                [matTooltip]="'common.edit' | translate">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="remove(item.id)"
                [matTooltip]="'common.delete' | translate">
                <mat-icon>delete</mat-icon>
              </button>
            }
          </div>

          @if (data.type === 'companies' && expandedCompanyId === item.id) {
            <div class="workers-panel">
              <div class="workers-title">{{ 'workTime.assignWorkers' | translate }}</div>
              @if (allUsers().length === 0) {
                <div class="workers-empty">{{ 'workTime.noWorkers' | translate }}</div>
              }
              @for (u of allUsers(); track u.id) {
                <mat-checkbox
                  [checked]="assignedIds().has(u.id)"
                  (change)="toggleAssign(u.id, $event.checked)">
                  {{ u.fullName }}
                </mat-checkbox>
              }
            </div>
          }
        }
        @if (items().length === 0) {
          <div class="empty">{{ 'workTime.noItems' | translate }}</div>
        }
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.close' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .add-row {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }
    .name-field { flex: 1; }
    .items-list { display: flex; flex-direction: column; gap: 4px; max-height: 400px; overflow-y: auto; }
    .item-row {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 6px;
      &:hover { background: #f5f5f5; }
    }
    .item-name { flex: 1; font-size: 14px; }
    .edit-field { flex: 1; }
    .empty { color: rgba(0,0,0,0.38); padding: 16px; text-align: center; }
    .workers-panel {
      display: flex; flex-direction: column; gap: 6px;
      padding: 10px 14px 14px 24px; margin: 0 8px 8px;
      background: #f7f8fc; border-left: 3px solid #3949ab; border-radius: 0 6px 6px 0;
    }
    .workers-title { font-size: 12px; font-weight: 600; color: #3949ab; margin-bottom: 2px; }
    .workers-empty { font-size: 13px; color: rgba(0,0,0,0.4); }
  `]
})
export class WorkTimeManagerDialogComponent implements OnInit {
  private svc = inject(WorkTimeService);
  private notify = inject(NotificationService);
  private translate = inject(TranslateService);
  dialogRef = inject(MatDialogRef<WorkTimeManagerDialogComponent>);
  data: { type: 'companies' | 'docTypes' } = inject(MAT_DIALOG_DATA);

  items = signal<(WorkTimeCompanyDto | WorkDocumentTypeDto)[]>([]);
  newName = '';
  editingId: number | null = null;
  editName = '';

  // Worker assignment (companies only)
  allUsers = signal<WorkTimeUserDto[]>([]);
  expandedCompanyId: number | null = null;
  assignedIds = signal<Set<number>>(new Set());

  ngOnInit(): void {
    this.load();
    if (this.data.type === 'companies') {
      this.svc.getUsers().subscribe(u => this.allUsers.set(u));
    }
  }

  toggleWorkers(companyId: number): void {
    if (this.expandedCompanyId === companyId) {
      this.expandedCompanyId = null;
      return;
    }
    this.expandedCompanyId = companyId;
    this.assignedIds.set(new Set());
    this.svc.getCompanyWorkerIds(companyId).subscribe(ids => this.assignedIds.set(new Set(ids)));
  }

  toggleAssign(userId: number, checked: boolean): void {
    if (this.expandedCompanyId === null) return;
    const next = new Set(this.assignedIds());
    if (checked) next.add(userId); else next.delete(userId);
    this.assignedIds.set(next);
    this.svc.setCompanyWorkers(this.expandedCompanyId, Array.from(next)).subscribe({
      next: () => this.notify.success(this.translate.instant('workTime.saved')),
      error: () => {
        // revert on failure
        const revert = new Set(this.assignedIds());
        if (checked) revert.delete(userId); else revert.add(userId);
        this.assignedIds.set(revert);
        this.notify.error(this.translate.instant('errors.failedToLoad'));
      }
    });
  }

  private load(): void {
    if (this.data.type === 'companies') {
      this.svc.getCompanies().subscribe(c => this.items.set(c));
    } else {
      this.svc.getDocumentTypes().subscribe(t => this.items.set(t));
    }
  }

  add(): void {
    const name = this.newName.trim();
    if (!name) return;

    const obs = this.data.type === 'companies'
      ? this.svc.createCompany(name)
      : this.svc.createDocumentType(name);

    obs.subscribe({
      next: () => {
        this.newName = '';
        this.notify.success(this.translate.instant('workTime.saved'));
        this.load();
      },
      error: () => this.notify.error(this.translate.instant('errors.failedToLoad'))
    });
  }

  startEdit(item: WorkTimeCompanyDto | WorkDocumentTypeDto): void {
    this.editingId = item.id;
    this.editName = item.name;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editName = '';
  }

  saveEdit(id: number): void {
    const name = this.editName.trim();
    if (!name) return;

    const obs = this.data.type === 'companies'
      ? this.svc.updateCompany(id, name)
      : this.svc.updateDocumentType(id, name);

    obs.subscribe({
      next: () => {
        this.cancelEdit();
        this.notify.success(this.translate.instant('workTime.saved'));
        this.load();
      },
      error: () => this.notify.error(this.translate.instant('errors.failedToLoad'))
    });
  }

  remove(id: number): void {
    const obs = this.data.type === 'companies'
      ? this.svc.deleteCompany(id)
      : this.svc.deleteDocumentType(id);

    obs.subscribe({
      next: () => {
        this.notify.success(this.translate.instant('workTime.deleted'));
        this.load();
      },
      error: () => this.notify.error(this.translate.instant('errors.failedToLoad'))
    });
  }
}
