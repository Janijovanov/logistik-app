import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExpensesService } from '../expenses.service';
import { ExpenseCategoryDto, ExpenseSubcategoryDto, ExpensesYearDto } from '../../../core/models/expense.models';
import { NotificationService } from '../../../core/services/notification.service';
import { CategoryManagerComponent } from '../category-manager/category-manager.component';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Noe', 'Dec'];

@Component({
  selector: 'app-expenses-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatDialogModule, MatTooltipModule
  ],
  template: `
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">Трошоци</h1>
        <div class="year-nav">
          <button mat-icon-button (click)="changeYear(-1)"><mat-icon>chevron_left</mat-icon></button>
          <span class="year-label">{{ year() }}</span>
          <button mat-icon-button (click)="changeYear(1)" [disabled]="year() >= currentYear"><mat-icon>chevron_right</mat-icon></button>
        </div>
      </div>
      <button mat-stroked-button (click)="openCategoryManager()">
        <mat-icon>settings</mat-icon>
        Управувај со категории
      </button>
    </div>

    @if (loading()) {
      <div class="loading"><mat-spinner diameter="40" /></div>
    } @else if (!data()) {
      <div class="empty">Нема податоци.</div>
    } @else {
      <div class="table-wrapper">
        <table class="expense-table">
          <thead>
            <tr>
              <th class="name-col">Назив</th>
              @for (m of months; track m) {
                <th class="month-col">{{ m }}</th>
              }
              <th class="sum-col">Вкупно</th>
              <th class="pct-col">%</th>
              <th class="plan-col">Месечно</th>
              <th class="plan-col">Годишно</th>
              <th class="no-col">бр.мес.</th>
            </tr>
          </thead>
          <tbody>
            <!-- Grand total row -->
            <tr class="grand-total-row">
              <td class="name-col">ВКУПНО</td>
              @for (m of [1,2,3,4,5,6,7,8,9,10,11,12]; track m) {
                <td class="amount-cell">{{ grandTotal()[m] || 0 | number:'1.0-0' }}</td>
              }
              <td class="sum-cell">{{ grandTotalVkupno() | number:'1.0-0' }}</td>
              <td class="pct-cell">{{ grandTotalPct() }}%</td>
              <td class="plan-cell">{{ grandMonthly() | number:'1.0-0' }}</td>
              <td class="plan-cell">{{ grandAnnual() | number:'1.0-0' }}</td>
              <td class="no-cell">{{ grandMonthCount() }}</td>
            </tr>

            @for (cat of data()!.categories; track cat.id) {
              <!-- Category header row -->
              <tr class="cat-row">
                <td class="name-col cat-name">{{ cat.name }}</td>
                @for (m of [1,2,3,4,5,6,7,8,9,10,11,12]; track m) {
                  <td class="amount-cell cat-amount">{{ catMonthTotal(cat, m) || '' | number:'1.0-0' }}</td>
                }
                <td class="sum-cell cat-amount">{{ catVkupno(cat) | number:'1.0-0' }}</td>
                <td class="pct-cell cat-pct">{{ catPct(cat) }}%</td>
                <td class="plan-cell cat-amount">{{ catMonthly(cat) | number:'1.0-0' }}</td>
                <td class="plan-cell cat-amount">{{ catAnnual(cat) | number:'1.0-0' }}</td>
                <td class="no-cell"></td>
              </tr>

              @for (sub of cat.subcategories; track sub.id) {
                <!-- Subcategory row -->
                <tr class="sub-row">
                  <td class="name-col sub-name">{{ sub.name }}</td>
                  @for (m of [1,2,3,4,5,6,7,8,9,10,11,12]; track m) {
                    <td
                      class="amount-cell editable"
                      (click)="startEdit(sub.id, m)"
                    >
                      @if (editingCell()?.subId === sub.id && editingCell()?.month === m) {
                        <input
                          class="cell-input"
                          type="number"
                          min="0"
                          [value]="sub.amounts[m] ?? ''"
                          (keydown.enter)="saveEntry($event, sub, m)"
                          (keydown.escape)="cancelEdit()"
                          (blur)="saveEntry($event, sub, m)"
                          #cellInput
                          (click)="$event.stopPropagation()"
                        />
                      } @else {
                        {{ sub.amounts[m] ? (sub.amounts[m] | number:'1.0-0') : '' }}
                      }
                    </td>
                  }
                  <td class="sum-cell">{{ subVkupno(sub) | number:'1.0-0' }}</td>
                  <td class="pct-cell">{{ subPct(sub) }}%</td>
                  <td class="plan-cell">{{ (sub.annualPlan / 12) | number:'1.0-0' }}</td>
                  <td
                    class="plan-cell editable"
                    (click)="startEditPlan(sub)"
                  >
                    @if (editingPlanSubId() === sub.id) {
                      <input
                        class="cell-input"
                        type="number"
                        min="0"
                        [value]="sub.annualPlan"
                        (keydown.enter)="savePlan($event, sub)"
                        (keydown.escape)="editingPlanSubId.set(null)"
                        (blur)="savePlan($event, sub)"
                        (click)="$event.stopPropagation()"
                      />
                    } @else {
                      {{ sub.annualPlan | number:'1.0-0' }}
                    }
                  </td>
                  <td class="no-cell">{{ monthCount(sub) }}</td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .page-title { font-size: 22px; font-weight: 700; margin: 0; }
    .year-nav { display: flex; align-items: center; gap: 4px; }
    .year-label { font-size: 18px; font-weight: 600; min-width: 52px; text-align: center; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .empty { text-align: center; padding: 60px; color: rgba(0,0,0,0.38); }

    .table-wrapper { overflow-x: auto; }

    .expense-table {
      border-collapse: collapse;
      font-size: 13px;
      white-space: nowrap;
      width: 100%;
    }

    .expense-table th, .expense-table td {
      border: 1px solid #ddd;
      padding: 4px 6px;
      text-align: right;
    }

    .name-col { text-align: left !important; min-width: 200px; max-width: 260px; white-space: normal; }
    .month-col { min-width: 64px; }
    .sum-col, .sum-cell { min-width: 80px; font-weight: 600; }
    .pct-col, .pct-cell { min-width: 56px; }
    .plan-col, .plan-cell { min-width: 72px; }
    .no-col, .no-cell { min-width: 48px; }

    .amount-cell { min-width: 64px; }
    .editable { cursor: pointer; }
    .editable:hover { background: rgba(57, 73, 171, 0.06); }

    thead th {
      background: #3949ab;
      color: white;
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .grand-total-row td {
      background: #1a237e;
      color: white;
      font-weight: 700;
    }

    .cat-row td {
      background: #e8eaf6;
      font-weight: 600;
    }
    .cat-name { font-weight: 700; }
    .cat-pct { color: #1565c0; }

    .sub-row td { background: white; }
    .sub-row:hover td { background: #f5f5f5; }
    .sub-name { padding-left: 16px !important; }

    .cell-input {
      width: 100%;
      border: none;
      background: #fff9c4;
      font-size: 13px;
      text-align: right;
      outline: 2px solid #f9a825;
      padding: 2px 4px;
      box-sizing: border-box;
    }
  `]
})
export class ExpensesPageComponent implements OnInit {
  private service = inject(ExpensesService);
  private dialog = inject(MatDialog);
  private notifications = inject(NotificationService);

  readonly months = MONTHS;
  readonly currentYear = new Date().getFullYear();

  year = signal(this.currentYear);
  loading = signal(false);
  data = signal<ExpensesYearDto | null>(null);
  editingCell = signal<{ subId: number; month: number } | null>(null);
  editingPlanSubId = signal<number | null>(null);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.service.getForYear(this.year()).subscribe({
      next: d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  changeYear(delta: number): void {
    this.year.update(y => y + delta);
    this.cancelEdit();
    this.load();
  }

  openCategoryManager(): void {
    this.dialog.open(CategoryManagerComponent, { width: '600px', maxWidth: '96vw' })
      .afterClosed().subscribe(() => this.load());
  }

  // ── Computed totals ────────────────────────────────────────────────────────

  catMonthTotal(cat: ExpenseCategoryDto, month: number): number {
    return cat.subcategories.reduce((s, sub) => s + (sub.amounts[month] ?? 0), 0);
  }
  catVkupno(cat: ExpenseCategoryDto): number {
    return [1,2,3,4,5,6,7,8,9,10,11,12].reduce((s, m) => s + this.catMonthTotal(cat, m), 0);
  }
  catAnnual(cat: ExpenseCategoryDto): number {
    return cat.subcategories.reduce((s, sub) => s + sub.annualPlan, 0);
  }
  catMonthly(cat: ExpenseCategoryDto): number { return this.catAnnual(cat) / 12; }
  catPct(cat: ExpenseCategoryDto): string {
    const annual = this.catAnnual(cat);
    if (!annual) return '0.00';
    return ((this.catVkupno(cat) / annual) * 100).toFixed(2);
  }

  subVkupno(sub: ExpenseSubcategoryDto): number {
    return Object.values(sub.amounts).reduce((s, v) => s + v, 0);
  }
  subPct(sub: ExpenseSubcategoryDto): string {
    if (!sub.annualPlan) return '0.00';
    return ((this.subVkupno(sub) / sub.annualPlan) * 100).toFixed(2);
  }
  monthCount(sub: ExpenseSubcategoryDto): number {
    return Object.values(sub.amounts).filter(v => v > 0).length;
  }

  grandTotal(): Record<number, number> {
    const totals: Record<number, number> = {};
    for (const m of [1,2,3,4,5,6,7,8,9,10,11,12]) {
      totals[m] = this.data()?.categories.reduce((s, cat) => s + this.catMonthTotal(cat, m), 0) ?? 0;
    }
    return totals;
  }
  grandTotalVkupno(): number { return Object.values(this.grandTotal()).reduce((s, v) => s + v, 0); }
  grandAnnual(): number { return this.data()?.categories.reduce((s, cat) => s + this.catAnnual(cat), 0) ?? 0; }
  grandMonthly(): number { return this.grandAnnual() / 12; }
  grandTotalPct(): string {
    const annual = this.grandAnnual();
    if (!annual) return '0.00';
    return ((this.grandTotalVkupno() / annual) * 100).toFixed(2);
  }
  grandMonthCount(): number {
    return this.data()?.categories.flatMap(c => c.subcategories).reduce((s, sub) => s + this.monthCount(sub), 0) ?? 0;
  }

  // ── Cell editing ───────────────────────────────────────────────────────────

  startEdit(subId: number, month: number): void {
    this.editingPlanSubId.set(null);
    this.editingCell.set({ subId, month });
    setTimeout(() => {
      const input = document.querySelector('.cell-input') as HTMLInputElement;
      input?.focus();
    });
  }

  cancelEdit(): void { this.editingCell.set(null); }

  saveEntry(event: Event, sub: ExpenseSubcategoryDto, month: number): void {
    const current = this.editingCell();
    if (!current || current.subId !== sub.id || current.month !== month) return;
    const input = event.target as HTMLInputElement;
    const amount = parseFloat(input.value) || 0;
    this.editingCell.set(null);
    this.service.upsertEntry(sub.id, this.year(), month, amount).subscribe({
      next: () => {
        if (amount > 0) sub.amounts[month] = amount;
        else delete sub.amounts[month];
        this.data.set({ ...this.data()! });
      },
      error: () => this.notifications.error('Грешка при зачувување.')
    });
  }

  startEditPlan(sub: ExpenseSubcategoryDto): void {
    this.editingCell.set(null);
    this.editingPlanSubId.set(sub.id);
    setTimeout(() => {
      const input = document.querySelector('.cell-input') as HTMLInputElement;
      input?.focus();
    });
  }

  savePlan(event: Event, sub: ExpenseSubcategoryDto): void {
    if (this.editingPlanSubId() !== sub.id) return;
    const input = event.target as HTMLInputElement;
    const plan = parseFloat(input.value) || 0;
    this.editingPlanSubId.set(null);
    this.service.updateSubcategory(sub.id, sub.categoryId, sub.name, plan).subscribe({
      next: () => {
        sub.annualPlan = plan;
        this.data.set({ ...this.data()! });
      },
      error: () => this.notifications.error('Грешка при зачувување.')
    });
  }
}
