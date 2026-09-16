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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WorkTimeService } from '../work-time.service';
import { NotificationService } from '../../../core/services/notification.service';
import { WorkTimeCompanyDto, WorkDocumentTypeDto } from '../../../core/models/work-time.models';

@Component({
  selector: 'app-work-time-manager-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
    MatDialogModule, MatListModule, MatTooltipModule, TranslateModule
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

  ngOnInit(): void {
    this.load();
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
