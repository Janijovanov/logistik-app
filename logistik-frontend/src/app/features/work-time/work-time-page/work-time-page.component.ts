import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WorkTimeService } from '../work-time.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { WorkTimeCompanyDto, WorkDocumentTypeDto, WorkTimeEntryDto, WorkTimeUserDto, WorkTimeMonthSummary } from '../../../core/models/work-time.models';
import { WorkTimeManagerDialogComponent } from '../work-time-manager-dialog/work-time-manager-dialog.component';

interface RowState {
  docType: WorkDocumentTypeDto;
  documentCount: number;
  minutes: number;
  notes: string;
  entryId: number | null;
  dirty: boolean;
  saving: boolean;
}

@Component({
  selector: 'app-work-time-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule,
    MatInputModule, MatProgressSpinnerModule, MatTooltipModule,
    MatDatepickerModule,
    MatDialogModule, TranslateModule
  ],
  template: `
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">{{ 'workTime.title' | translate }}</h1>
      </div>
      @if (isAdmin()) {
        <div class="header-actions">
          <button mat-stroked-button (click)="openManager('companies')">
            <mat-icon>business</mat-icon>
            {{ 'workTime.manageCompanies' | translate }}
          </button>
          <button mat-stroked-button (click)="openManager('docTypes')">
            <mat-icon>description</mat-icon>
            {{ 'workTime.manageDocTypes' | translate }}
          </button>
        </div>
      }
    </div>

    <!-- Filters -->
    <div class="filters-row">
      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>{{ 'common.date' | translate }}</mat-label>
        <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDateObj"
          (dateChange)="onDateChange()" placeholder="дд.мм.гггг" />
        <mat-datepicker-toggle matIconSuffix [for]="picker" />
        <mat-datepicker #picker [dateClass]="dateClass" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>{{ 'workTime.company' | translate }}</mat-label>
        <mat-select [(ngModel)]="selectedCompanyId" (selectionChange)="onFilterChange()">
          @for (c of companies(); track c.id) {
            <mat-option [value]="c.id">{{ c.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      @if (isAdmin()) {
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>{{ 'workTime.worker' | translate }}</mat-label>
          <mat-select [(ngModel)]="selectedUserId" (selectionChange)="onFilterChange()">
            <mat-option [value]="null">{{ 'workTime.allWorkers' | translate }}</mat-option>
            @for (u of users(); track u.id) {
              <mat-option [value]="u.id">{{ u.fullName }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      }
    </div>

    <!-- Per-company yearly breakdown by month -->
    @if (selectedCompanyId && yearlySummary().length > 0) {
      <div class="year-summary">
        <h3 class="year-summary-title">
          {{ 'workTime.yearSummary' | translate }} — {{ selectedDateObj.getFullYear() }}
        </h3>
        <div class="table-wrapper">
          <table class="wt-table aligned">
            <colgroup><col class="col-name" /><col class="col-num" /><col class="col-num" /><col class="col-num" /><col /></colgroup>
            <thead>
              <tr>
                <th>{{ 'workTime.month' | translate }}</th>
                <th class="num-col">{{ 'workTime.docCount' | translate }}</th>
                <th class="num-col">{{ 'workTime.minutes' | translate }}</th>
                <th class="num-col">{{ 'workTime.avgTime' | translate }}</th>
                <th class="notes-col"></th>
              </tr>
            </thead>
            <tbody>
              @for (row of yearlySummary(); track row.month) {
                <tr>
                  <td class="name-cell">{{ monthName(row.month) }}</td>
                  <td class="num-col" [attr.data-label]="'workTime.docCount' | translate">{{ row.documentCount }}</td>
                  <td class="num-col" [attr.data-label]="'workTime.minutes' | translate">{{ row.minutes }}</td>
                  <td class="num-col" [attr.data-label]="'workTime.avgTime' | translate">{{ avgTime(row.minutes, row.documentCount) | number:'1.0-1':'mk' }}</td>
                  <td class="ghost-cell notes-col"></td>
                </tr>
              }
              <tr class="grand-total-row">
                <td class="name-cell"><strong>{{ 'workTime.total' | translate }}</strong></td>
                <td class="num-col" [attr.data-label]="'workTime.docCount' | translate"><strong>{{ yearTotalDocs() }}</strong></td>
                <td class="num-col" [attr.data-label]="'workTime.minutes' | translate"><strong>{{ yearTotalMinutes() }}</strong></td>
                <td class="num-col" [attr.data-label]="'workTime.avgTime' | translate"><strong>{{ avgTime(yearTotalMinutes(), yearTotalDocs()) | number:'1.0-1':'mk' }}</strong></td>
                <td class="ghost-cell notes-col"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    }

    @if (!selectedCompanyId) {
      <div class="empty-state">
        <mat-icon>business</mat-icon>
        <p>{{ 'workTime.selectCompany' | translate }}</p>
      </div>
    } @else if (loading()) {
      <div class="loading"><mat-spinner diameter="40" /></div>
    } @else {
      <!-- Admin: showing all users grouped -->
      @if (isAdmin() && !selectedUserId) {
        <div class="admin-summary">
          <!-- Day + month totals for the company (only when there is data) -->
          @if (entries().length > 0 || monthlyTotal().documentCount > 0 || monthlyTotal().minutes > 0) {
          <div class="company-total">
            <table class="wt-table aligned">
              <colgroup><col class="col-name" /><col class="col-num" /><col class="col-num" /><col class="col-num" /><col /></colgroup>
              <thead>
                <tr>
                  <th></th>
                  <th class="num-col">{{ 'workTime.docCount' | translate }}</th>
                  <th class="num-col">{{ 'workTime.minutes' | translate }}</th>
                  <th class="num-col">{{ 'workTime.avgTime' | translate }}</th>
                  <th class="notes-col"></th>
                </tr>
              </thead>
              <tbody>
                @if (adminGroups().length > 0) {
                  <tr class="grand-total-row">
                    <td class="name-cell"><strong>{{ 'workTime.companyTotal' | translate }}</strong></td>
                    <td class="num-col" [attr.data-label]="'workTime.docCount' | translate"><strong>{{ groupTotal(entries(), 'documentCount') }}</strong></td>
                    <td class="num-col" [attr.data-label]="'workTime.minutes' | translate"><strong>{{ groupTotal(entries(), 'minutes') }}</strong></td>
                    <td class="num-col" [attr.data-label]="'workTime.avgTime' | translate"><strong>{{ avgTime(groupTotal(entries(), 'minutes'), groupTotal(entries(), 'documentCount')) | number:'1.0-1':'mk' }}</strong></td>
                    <td class="ghost-cell notes-col"></td>
                  </tr>
                }
                <tr class="grand-total-row month-total-row">
                  <td class="name-cell"><strong>{{ 'workTime.monthTotal' | translate }} ({{ monthLabel() }})</strong></td>
                  <td class="num-col" [attr.data-label]="'workTime.docCount' | translate"><strong>{{ monthlyTotal().documentCount }}</strong></td>
                  <td class="num-col" [attr.data-label]="'workTime.minutes' | translate"><strong>{{ monthlyTotal().minutes }}</strong></td>
                  <td class="num-col" [attr.data-label]="'workTime.avgTime' | translate"><strong>{{ avgTime(monthlyTotal().minutes, monthlyTotal().documentCount) | number:'1.0-1':'mk' }}</strong></td>
                  <td class="ghost-cell notes-col"></td>
                </tr>
              </tbody>
            </table>
          </div>
          }

          @if (adminGroups().length === 0) {
            <div class="empty-state">
              <mat-icon>inbox</mat-icon>
              <p>{{ 'workTime.noEntries' | translate }}</p>
            </div>
          } @else {
            @for (group of adminGroups(); track group.userId) {
              <div class="user-group">
                <h3 class="group-title">{{ group.userName }}</h3>
                <div class="table-wrapper">
                  <table class="wt-table aligned">
                    <colgroup><col class="col-name" /><col class="col-num" /><col class="col-num" /><col class="col-num" /><col /></colgroup>
                    <thead>
                      <tr>
                        <th>{{ 'workTime.docType' | translate }}</th>
                        <th class="num-col">{{ 'workTime.docCount' | translate }}</th>
                        <th class="num-col">{{ 'workTime.minutes' | translate }}</th>
                        <th class="num-col">{{ 'workTime.avgTime' | translate }}</th>
                        <th class="notes-col">{{ 'common.notes' | translate }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (entry of group.entries; track entry.id) {
                        <tr>
                          <td class="name-cell">{{ entry.documentTypeName }}</td>
                          <td class="num-col" [attr.data-label]="'workTime.docCount' | translate">{{ entry.documentCount }}</td>
                          <td class="num-col" [attr.data-label]="'workTime.minutes' | translate">{{ entry.minutes }}</td>
                          <td class="num-col" [attr.data-label]="'workTime.avgTime' | translate">{{ avgTime(entry.minutes, entry.documentCount) | number:'1.0-1':'mk' }}</td>
                          <td class="notes-col" [attr.data-label]="'common.notes' | translate">{{ entry.notes || '—' }}</td>
                        </tr>
                      }
                      <tr class="totals-row">
                        <td class="name-cell"><strong>{{ 'workTime.total' | translate }}</strong></td>
                        <td class="num-col" [attr.data-label]="'workTime.docCount' | translate"><strong>{{ groupTotal(group.entries, 'documentCount') }}</strong></td>
                        <td class="num-col" [attr.data-label]="'workTime.minutes' | translate"><strong>{{ groupTotal(group.entries, 'minutes') }}</strong></td>
                        <td class="num-col" [attr.data-label]="'workTime.avgTime' | translate"><strong>{{ avgTime(groupTotal(group.entries, 'minutes'), groupTotal(group.entries, 'documentCount')) | number:'1.0-1':'mk' }}</strong></td>
                        <td class="ghost-cell"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            }
          }
        </div>
      } @else {
        <!-- User entry form (own data, or admin filtered to one user) -->
        <div class="entry-form">
          @if (rows().length === 0) {
            <div class="empty-state">
              <mat-icon>inbox</mat-icon>
              <p>{{ 'workTime.noDocTypes' | translate }}</p>
            </div>
          } @else {
            <div class="table-wrapper">
              <table class="wt-table editable-table">
                <colgroup>
                  <col class="col-order" /><col class="col-name" /><col class="col-num" />
                  <col class="col-num" /><col class="col-num" /><col /><col class="col-action" />
                </colgroup>
                <thead>
                  <tr>
                    <th class="order-col">Бр.</th>
                    <th>{{ 'workTime.docType' | translate }}</th>
                    <th class="num-col">{{ 'workTime.docCount' | translate }}</th>
                    <th class="num-col">{{ 'workTime.minutes' | translate }}</th>
                    <th class="num-col">{{ 'workTime.avgTime' | translate }}</th>
                    <th class="notes-col">{{ 'common.notes' | translate }}</th>
                    <th class="action-col"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of rows(); track row.docType.id; let i = $index) {
                    <tr [class.has-data]="row.documentCount > 0 || row.minutes > 0">
                      <td class="order-col">{{ row.docType.order }}</td>
                      <td class="type-name">{{ row.docType.name }}</td>
                      <td class="num-col" [attr.data-label]="'workTime.docCount' | translate">
                        <input
                          type="number"
                          class="num-input"
                          [(ngModel)]="row.documentCount"
                          (ngModelChange)="row.dirty = true"
                          min="0"
                          placeholder="0"
                        />
                      </td>
                      <td class="num-col" [attr.data-label]="'workTime.minutes' | translate">
                        <input
                          type="number"
                          class="num-input"
                          [(ngModel)]="row.minutes"
                          (ngModelChange)="row.dirty = true"
                          min="0"
                          placeholder="0"
                        />
                      </td>
                      <td class="num-col avg-cell" [attr.data-label]="'workTime.avgTime' | translate">{{ avgTime(+row.minutes, +row.documentCount) | number:'1.0-1':'mk' }}</td>
                      <td class="notes-col" [attr.data-label]="'common.notes' | translate">
                        <input
                          type="text"
                          class="notes-input"
                          [(ngModel)]="row.notes"
                          (ngModelChange)="row.dirty = true"
                          placeholder="{{ 'workTime.notesOptional' | translate }}"
                        />
                      </td>
                      <td class="action-col">
                        @if (row.saving) {
                          <mat-spinner diameter="18" />
                        } @else if (row.dirty) {
                          <button mat-icon-button color="primary" (click)="saveRow(row)"
                            [matTooltip]="'common.save' | translate">
                            <mat-icon>save</mat-icon>
                          </button>
                        } @else if (row.entryId) {
                          <button mat-icon-button color="warn" (click)="deleteRow(row)"
                            [matTooltip]="'common.delete' | translate">
                            <mat-icon>delete</mat-icon>
                          </button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
                <tfoot>
                  <tr class="grand-total-row">
                    <td class="ghost-cell"></td>
                    <td class="name-cell"><strong>{{ 'workTime.dayTotal' | translate }}</strong></td>
                    <td class="num-col" [attr.data-label]="'workTime.docCount' | translate"><strong>{{ totalDocs() }}</strong></td>
                    <td class="num-col" [attr.data-label]="'workTime.minutes' | translate"><strong>{{ totalMinutes() }}</strong></td>
                    <td class="num-col" [attr.data-label]="'workTime.avgTime' | translate"><strong>{{ avgTime(totalMinutes(), totalDocs()) | number:'1.0-1':'mk' }}</strong></td>
                    <td colspan="2" class="ghost-cell"></td>
                  </tr>
                  <tr class="grand-total-row month-total-row">
                    <td class="ghost-cell"></td>
                    <td class="name-cell"><strong>{{ 'workTime.monthTotal' | translate }} ({{ monthLabel() }})</strong></td>
                    <td class="num-col" [attr.data-label]="'workTime.docCount' | translate"><strong>{{ monthlyTotal().documentCount }}</strong></td>
                    <td class="num-col" [attr.data-label]="'workTime.minutes' | translate"><strong>{{ monthlyTotal().minutes }}</strong></td>
                    <td class="num-col" [attr.data-label]="'workTime.avgTime' | translate"><strong>{{ avgTime(monthlyTotal().minutes, monthlyTotal().documentCount) | number:'1.0-1':'mk' }}</strong></td>
                    <td colspan="2" class="ghost-cell"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="save-all-row">
              <button mat-flat-button color="primary" (click)="saveAll()" [disabled]="!hasDirty()">
                <mat-icon>save</mat-icon>
                {{ 'workTime.saveAll' | translate }}
              </button>
            </div>
          }
        </div>
      }
    }
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .page-title { font-size: 24px; font-weight: 500; margin: 0; }
    .header-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .filters-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .filter-field { min-width: 200px; }
    .loading { display: flex; justify-content: center; padding: 40px; }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      color: rgba(0,0,0,0.38);
      gap: 8px;
      mat-icon { font-size: 48px; width: 48px; height: 48px; }
      p { font-size: 16px; margin: 0; }
    }
    .table-wrapper { overflow-x: auto; }
    .wt-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      th {
        background: #f5f5f5;
        padding: 10px 12px;
        text-align: left;
        font-weight: 600;
        border-bottom: 2px solid #e0e0e0;
        white-space: nowrap;
      }
      td {
        padding: 6px 12px;
        border-bottom: 1px solid #f0f0f0;
        vertical-align: middle;
      }
      tr:hover td { background: #fafafa; }
    }
    .order-col { width: 40px; text-align: center; color: rgba(0,0,0,0.45); }
    .num-col { text-align: center !important; }
    .notes-col { min-width: 160px; }
    .action-col { width: 48px; text-align: center; }
    .type-name { font-weight: 500; }
    .has-data td { background: #f0f7ff; }
    .has-data:hover td { background: #e8f4fe; }
    .totals-row td {
      background: #eeeeee !important;
      font-weight: 600;
      border-top: 2px solid #ddd;
    }
    .num-input, .notes-input {
      border: 1px solid transparent;
      border-radius: 4px;
      padding: 4px 6px;
      font-size: 13px;
      background: transparent;
      transition: border-color 0.2s, background 0.2s;
      &:focus { outline: none; border-color: #3949ab; background: white; }
      &:hover { border-color: #bdbdbd; }
    }
    .num-input { width: 70px; text-align: center; }
    .notes-input { width: 100%; box-sizing: border-box; }
    .save-all-row {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
    .admin-summary { display: flex; flex-direction: column; gap: 16px; }
    .year-summary { margin: 0 0 24px; }
    .year-summary-title { font-size: 15px; font-weight: 600; margin: 0 0 8px; color: #3949ab; }
    .avg-cell { color: rgba(0,0,0,0.55); }
    @media (max-width: 768px) {
      .header-actions { width: 100%; }
      .header-actions > button { flex: 1 1 auto; }
      .filter-field { width: 100%; min-width: 0; }
      .save-all-row button { width: 100%; }

      /* Stacked cards: each row becomes a small card with label/value lines */
      .wt-table { table-layout: auto; min-width: 0; }
      .wt-table colgroup, .wt-table thead { display: none; }
      .wt-table tr {
        display: block;
        padding: 8px 0;
        border-bottom: 6px solid #f0f2f5;
      }
      .wt-table td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        border-bottom: none;
        padding: 4px 14px;
        text-align: right;
        width: auto;
      }
      .wt-table td[data-label]::before {
        content: attr(data-label);
        font-weight: 600;
        font-size: 12px;
        color: rgba(0,0,0,0.54);
        flex-shrink: 0;
        text-align: left;
      }
      /* Doc-type name acts as the card title */
      .wt-table td.name-cell, .wt-table td.type-name {
        justify-content: flex-start;
        text-align: left;
        font-weight: 600;
        padding-top: 6px;
      }
      /* Row number folds next to nothing - hide it, and hide filler cells */
      .wt-table td.order-col, .wt-table td.ghost-cell { display: none; }
      /* Action buttons right-aligned */
      .wt-table td.action-col { justify-content: flex-end; min-height: 36px; }
      /* Inputs sized for touch */
      .num-input { width: 96px; border-color: #d0d0d0; background: white; padding: 8px; }
      .notes-input { max-width: 65%; border-color: #d0d0d0; background: white; padding: 8px; }
    }
    .user-group { margin-bottom: 8px; }
    .group-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #3949ab;
    }
    .company-total { margin-top: 8px; }
    /* Fixed layout so every admin table shares identical column widths.
       Name gets ~40% so there is visible distance before the numbers,
       numbers are two narrow centered columns, notes take the rest. */
    .wt-table.aligned { table-layout: fixed; width: 100%; }
    .aligned .col-name { width: 40%; }
    .aligned .col-num { width: 175px; }
    .aligned td, .aligned th { overflow: hidden; text-overflow: ellipsis; }
    /* Editable table: same fixed layout so header, inputs and totals line up */
    .editable-table { table-layout: fixed; width: 100%; }
    .editable-table .col-order { width: 48px; }
    .editable-table .col-name { width: 38%; }
    .editable-table .col-num { width: 175px; }
    .editable-table .col-action { width: 56px; }
    .grand-total-row td {
      background: #e8eaf6 !important;
      font-weight: 700;
      font-size: 14px;
      border-top: 2px solid #3949ab;
      color: #1a237e;
    }
    .month-total-row td {
      background: #fff8e1 !important;
      color: #795548;
      border-top: 1px solid #ffb300;
    }
  `]
})
export class WorkTimePageComponent implements OnInit {
  private svc = inject(WorkTimeService);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  isAdmin = computed(() => this.auth.currentUser()?.role === 'Admin');

  companies = signal<WorkTimeCompanyDto[]>([]);
  docTypes = signal<WorkDocumentTypeDto[]>([]);
  users = signal<WorkTimeUserDto[]>([]);
  entries = signal<WorkTimeEntryDto[]>([]);
  rows = signal<RowState[]>([]);
  loading = signal(false);
  monthlyTotal = signal<{ documentCount: number; minutes: number }>({ documentCount: 0, minutes: 0 });
  yearlySummary = signal<WorkTimeMonthSummary[]>([]);
  private entryDates = new Set<string>();

  // Average minutes per document, used across every table.
  avgTime(minutes: number, docs: number): number { return docs > 0 ? minutes / docs : 0; }
  monthName(m: number): string { return WorkTimePageComponent.MK_MONTHS[m - 1] ?? ''; }
  yearTotalDocs(): number { return this.yearlySummary().reduce((s, r) => s + r.documentCount, 0); }
  yearTotalMinutes(): number { return this.yearlySummary().reduce((s, r) => s + r.minutes, 0); }

  // Highlights calendar days that already have entries for the selected company/worker.
  dateClass = (d: Date): string => {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return this.entryDates.has(`${d.getFullYear()}-${m}-${day}`) ? 'wt-has-entries' : '';
  };

  private static readonly MK_MONTHS = [
    'Јануари', 'Февруари', 'Март', 'Април', 'Мај', 'Јуни',
    'Јули', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'
  ];

  monthLabel(): string {
    const d = this.selectedDateObj;
    return `${WorkTimePageComponent.MK_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }

  selectedDateObj: Date = new Date();
  selectedCompanyId: number | null = null;
  selectedUserId: number | null = null;

  get selectedDate(): string {
    const d = this.selectedDateObj;
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  // Plain methods, not computed(): rows are mutated in place so the
  // rows() signal never fires â€” computed values would stay stale.
  totalDocs(): number { return this.rows().reduce((s, r) => s + (+r.documentCount || 0), 0); }
  totalMinutes(): number { return this.rows().reduce((s, r) => s + (+r.minutes || 0), 0); }
  hasDirty(): boolean { return this.rows().some(r => r.dirty); }

  adminGroups = computed(() => {
    const map = new Map<number, { userId: number; userName: string; entries: WorkTimeEntryDto[] }>();
    for (const e of this.entries()) {
      if (!map.has(e.userId)) map.set(e.userId, { userId: e.userId, userName: e.userName, entries: [] });
      map.get(e.userId)!.entries.push(e);
    }
    return Array.from(map.values()).sort((a, b) => a.userName.localeCompare(b.userName));
  });

  ngOnInit(): void {
    this.svc.getCompanies().subscribe(c => this.companies.set(c));
    this.svc.getDocumentTypes().subscribe(t => this.docTypes.set(t));
    if (this.isAdmin()) {
      this.svc.getUsers().subscribe(u => this.users.set(u));
    }
  }

  onDateChange(): void {
    this.onFilterChange();
  }

  onFilterChange(): void {
    if (!this.selectedCompanyId) return;
    this.loadEntries();
  }

  private loadEntries(): void {
    if (!this.selectedCompanyId) return;
    this.loading.set(true);

    const userId = this.isAdmin() ? this.selectedUserId ?? undefined : undefined;
    this.svc.getEntries(this.selectedDate, this.selectedCompanyId, userId ?? undefined).subscribe({
      next: entries => {
        this.entries.set(entries);
        if (!this.isAdmin() || this.selectedUserId !== null) {
          this.buildRows(entries);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    this.svc.getMonthlyTotal(this.selectedDate, this.selectedCompanyId, userId ?? undefined).subscribe({
      next: total => this.monthlyTotal.set(total),
      error: () => this.monthlyTotal.set({ documentCount: 0, minutes: 0 })
    });

    this.svc.getEntryDates(this.selectedCompanyId, userId ?? undefined).subscribe({
      next: dates => this.entryDates = new Set(dates),
      error: () => this.entryDates.clear()
    });

    this.svc.getYearlySummary(this.selectedCompanyId, this.selectedDateObj.getFullYear(), userId ?? undefined).subscribe({
      next: s => this.yearlySummary.set(s),
      error: () => this.yearlySummary.set([])
    });
  }

  private buildRows(entries: WorkTimeEntryDto[]): void {
    const entryMap = new Map<number, WorkTimeEntryDto>(entries.map(e => [e.workDocumentTypeId, e]));
    const newRows: RowState[] = this.docTypes().map(dt => {
      const existing = entryMap.get(dt.id);
      return {
        docType: dt,
        documentCount: existing?.documentCount ?? 0,
        minutes: existing?.minutes ?? 0,
        notes: existing?.notes ?? '',
        entryId: existing?.id ?? null,
        dirty: false,
        saving: false
      };
    });
    this.rows.set(newRows);
  }

  saveRow(row: RowState): void {
    if (!this.selectedCompanyId) return;
    row.saving = true;

    this.svc.upsertEntry({
      date: this.selectedDate,
      companyId: this.selectedCompanyId,
      documentTypeId: row.docType.id,
      documentCount: row.documentCount || 0,
      minutes: row.minutes || 0,
      notes: row.notes || null,
      userId: this.isAdmin() && this.selectedUserId ? this.selectedUserId : undefined
    }).subscribe({
      next: () => {
        row.dirty = false;
        row.saving = false;
        this.notify.success(this.translate.instant('workTime.saved'));
        this.loadEntries();
      },
      error: () => {
        row.saving = false;
        this.notify.error(this.translate.instant('errors.failedToLoad'));
      }
    });
  }

  saveAll(): void {
    const dirty = this.rows().filter(r => r.dirty);
    dirty.forEach(r => this.saveRow(r));
  }

  deleteRow(row: RowState): void {
    if (!row.entryId) return;
    this.svc.deleteEntry(row.entryId).subscribe({
      next: () => {
        this.notify.success(this.translate.instant('workTime.deleted'));
        this.loadEntries();
      },
      error: () => this.notify.error(this.translate.instant('errors.failedToLoad'))
    });
  }

  groupTotal(entries: WorkTimeEntryDto[], field: 'documentCount' | 'minutes'): number {
    return entries.reduce((s, e) => s + e[field], 0);
  }

  openManager(type: 'companies' | 'docTypes'): void {
    const ref = this.dialog.open(WorkTimeManagerDialogComponent, {
      width: '520px',
      data: { type }
    });
    ref.afterClosed().subscribe(() => {
      if (type === 'companies') {
        this.svc.getCompanies().subscribe(c => this.companies.set(c));
      } else {
        this.svc.getDocumentTypes().subscribe(t => {
          this.docTypes.set(t);
          if (this.selectedCompanyId) this.loadEntries();
        });
      }
    });
  }
}
