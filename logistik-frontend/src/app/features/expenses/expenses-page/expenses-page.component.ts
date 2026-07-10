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
const PLAN_COL = 13; // logical column for the editable "Месечно" (monthly plan) cell

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
      <p class="hint">Кликни на поле за внес · <kbd>Tab</kbd> следно · <kbd>↑↓←→</kbd> движење · <kbd>Enter</kbd> надолу</p>
      <div class="table-wrapper">
        <table class="expense-table">
          <thead>
            <tr>
              <th class="idx-col">Бр.</th>
              <th class="name-col">Назив</th>
              @for (m of months; track m) {
                <th class="month-col">{{ m }}</th>
              }
              <th class="sum-col">Вкупно</th>
              <th class="pct-col">%</th>
              <th class="plan-col">Месечно</th>
              <th class="plan-col">Годишно</th>
              <th class="cnt-col">бр.мес.</th>
            </tr>
          </thead>
          <tbody>
            @for (cat of data()!.categories; track cat.id; let catIdx = $index) {
              <!-- Category header row -->
              <tr class="cat-row">
                <td class="idx-col cat-no">{{ catIdx + 1 }}</td>
                <td class="name-col cat-name">{{ cat.name }}</td>
                @for (m of monthNums; track m) {
                  <td class="amount-cell cat-amount">{{ catMonthTotal(cat, m) || '' | number:'1.0-0' }}</td>
                }
                <td class="sum-cell cat-amount">{{ catVkupno(cat) | number:'1.0-0' }}</td>
                <td class="pct-cell cat-pct">{{ pctOfTotal(catVkupno(cat)) }}%</td>
                <td class="plan-cell cat-amount">{{ catMonthly(cat) | number:'1.0-0' }}</td>
                <td class="plan-cell cat-amount">{{ catAnnual(cat) | number:'1.0-0' }}</td>
                <td class="cnt-col"></td>
              </tr>

              @for (sub of cat.subcategories; track sub.id; let subIdx = $index) {
                <!-- Subcategory row -->
                <tr class="sub-row">
                  <td class="idx-col sub-no">{{ catIdx + 1 }}.{{ subIdx + 1 }}</td>
                  <td class="name-col sub-name">{{ sub.name }}</td>
                  @for (m of monthNums; track m) {
                    <td class="amount-cell editable" (click)="startEdit(sub.id, m)">
                      @if (isEditing(sub.id, m)) {
                        <input
                          class="cell-input"
                          type="text"
                          inputmode="numeric"
                          [value]="sub.amounts[m] ?? ''"
                          (keydown)="onKeyMonth($event, sub, m)"
                          (blur)="onBlurMonth($event, sub, m)"
                          (click)="$event.stopPropagation()"
                        />
                      } @else {
                        {{ sub.amounts[m] ? (sub.amounts[m] | number:'1.0-0') : '' }}
                      }
                    </td>
                  }
                  <td class="sum-cell">{{ subVkupno(sub) | number:'1.0-0' }}</td>
                  <td class="pct-cell">{{ pctOfTotal(subVkupno(sub)) }}%</td>
                  <!-- Месечно: editable input -->
                  <td class="plan-cell editable" (click)="startEditPlan(sub.id)">
                    @if (isEditingPlan(sub.id)) {
                      <input
                        class="cell-input"
                        type="text"
                        inputmode="numeric"
                        [value]="monthlyPlan(sub) || ''"
                        (keydown)="onKeyPlan($event, sub)"
                        (blur)="onBlurPlan($event, sub)"
                        (click)="$event.stopPropagation()"
                      />
                    } @else {
                      {{ monthlyPlan(sub) ? (monthlyPlan(sub) | number:'1.0-0') : '' }}
                    }
                  </td>
                  <!-- Годишно: computed = monthly × 12 -->
                  <td class="plan-cell annual-cell">{{ sub.annualPlan | number:'1.0-0' }}</td>
                  <td class="cnt-col">{{ monthCount(sub) }}</td>
                </tr>
              }
            }

            <!-- Grand total row -->
            <tr class="grand-total-row">
              <td class="idx-col"></td>
              <td class="name-col">ВКУПНО</td>
              @for (m of monthNums; track m) {
                <td class="amount-cell">{{ grandTotal()[m] || 0 | number:'1.0-0' }}</td>
              }
              <td class="sum-cell">{{ grandTotalVkupno() | number:'1.0-0' }}</td>
              <td class="pct-cell">{{ grandTotalVkupno() ? '100.00' : '0.00' }}%</td>
              <td class="plan-cell">{{ grandMonthly() | number:'1.0-0' }}</td>
              <td class="plan-cell">{{ grandAnnual() | number:'1.0-0' }}</td>
              <td class="cnt-col">{{ grandMonthCount() }}</td>
            </tr>
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
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .header-left { display: flex; align-items: center; gap: 16px; }
    @media (max-width: 768px) {
      .header-left { width: 100%; justify-content: space-between; }
      .page-header > button { width: 100%; }
    }
    .page-title { font-size: 22px; font-weight: 700; margin: 0; }
    .year-nav { display: flex; align-items: center; gap: 4px; }
    .year-label { font-size: 18px; font-weight: 600; min-width: 52px; text-align: center; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .empty { text-align: center; padding: 60px; color: rgba(0,0,0,0.38); }

    .hint {
      font-size: 12px; color: rgba(0,0,0,0.5); margin: 0 0 8px;
      display: flex; gap: 6px; flex-wrap: wrap; align-items: center;
    }
    .hint kbd {
      background: #eceff1; border: 1px solid #cfd8dc; border-bottom-width: 2px;
      border-radius: 4px; padding: 0 5px; font-size: 11px; font-family: inherit; color: #37474f;
    }

    .table-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      max-height: calc(100vh - 190px);
    }

    .expense-table {
      border-collapse: separate;
      border-spacing: 0;
      font-size: 12.5px;
      white-space: nowrap;
      width: auto;
    }

    .expense-table th, .expense-table td {
      border-right: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;
      padding: 3px 8px;
      text-align: right;
      height: 30px;
    }

    /* ── Column widths ───────────────────────────────── */
    .idx-col  { width: 44px;  min-width: 44px;  text-align: center !important; }
    .name-col { min-width: 88px; text-align: left !important; white-space: nowrap; }
    .month-col, .amount-cell { width: 58px; min-width: 58px; }
    .sum-col, .sum-cell { width: 82px; min-width: 82px; font-weight: 600; }
    .pct-col, .pct-cell { width: 58px; min-width: 58px; }
    .plan-col, .plan-cell { width: 74px; min-width: 74px; }
    .cnt-col { width: 50px; min-width: 50px; text-align: center; }

    /* ── Sticky header ───────────────────────────────── */
    thead th {
      background: #3949ab;
      color: white;
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 3;
      border-right-color: #4d5cc0;
      border-bottom-color: #4d5cc0;
    }

    /* ── Sticky first two columns (Бр. + Назив) ──────── */
    .idx-col  { position: sticky; left: 0;    z-index: 2; }
    .name-col { position: sticky; left: 44px; z-index: 2; box-shadow: 3px 0 5px -2px rgba(0,0,0,0.12); }
    thead .idx-col, thead .name-col { z-index: 4; }

    /* ── Row styling ─────────────────────────────────── */
    .cat-row td   { background: #e8eaf6; font-weight: 600; }
    .cat-name     { font-weight: 700; }
    .cat-pct      { color: #1565c0; }
    .cat-no       { font-weight: 700; }

    .sub-row td        { background: #ffffff; }
    .sub-row:hover td  { background: #f4f6ff; }
    .sub-name          { padding-left: 14px !important; }
    .sub-no            { color: rgba(0,0,0,0.5); font-size: 11px; }
    .annual-cell       { color: rgba(0,0,0,0.6); font-style: italic; }

    .grand-total-row td { background: #1a237e; color: white; font-weight: 700; }

    .editable { cursor: pointer; }
    .editable:hover { background: rgba(57, 73, 171, 0.08) !important; }

    .cell-input {
      width: 100%;
      border: none;
      background: #fff9c4;
      font-size: 12.5px;
      text-align: right;
      outline: 2px solid #f9a825;
      padding: 2px 4px;
      box-sizing: border-box;
      /* no spinner arrows */
      -moz-appearance: textfield;
    }
    .cell-input::-webkit-outer-spin-button,
    .cell-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

    @media (max-width: 768px) {
      .expense-table { font-size: 11.5px; }
      .expense-table th, .expense-table td { padding: 3px 5px; height: 32px; }
      .name-col { min-width: 88px; left: 40px; }
      .idx-col { width: 40px; min-width: 40px; }
      .month-col, .amount-cell { width: 50px; min-width: 50px; }
      .table-wrapper { max-height: calc(100vh - 210px); }
    }
  `]
})
export class ExpensesPageComponent implements OnInit {
  private service = inject(ExpensesService);
  private dialog = inject(MatDialog);
  private notifications = inject(NotificationService);

  readonly months = MONTHS;
  readonly monthNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  readonly currentYear = new Date().getFullYear();

  year = signal(this.currentYear);
  loading = signal(false);
  data = signal<ExpensesYearDto | null>(null);
  editingCell = signal<{ subId: number; month: number } | null>(null);
  editingPlanSubId = signal<number | null>(null);

  // Flat list of subcategories in visual order — the grid's row axis for keyboard nav.
  flatSubs = computed<ExpenseSubcategoryDto[]>(() =>
    (this.data()?.categories ?? []).flatMap(c => c.subcategories));

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
    this.editingCell.set(null);
    this.editingPlanSubId.set(null);
    this.load();
  }

  openCategoryManager(): void {
    this.dialog.open(CategoryManagerComponent, { width: '600px', maxWidth: '96vw' })
      .afterClosed().subscribe(() => this.load());
  }

  // ── Computed totals ────────────────────────────────────────────────────────

  pctOfTotal(amount: number): string {
    const total = this.grandTotalVkupno();
    if (!total) return '0.00';
    return ((amount / total) * 100).toFixed(2);
  }

  catMonthTotal(cat: ExpenseCategoryDto, month: number): number {
    return cat.subcategories.reduce((s, sub) => s + (sub.amounts[month] ?? 0), 0);
  }
  catVkupno(cat: ExpenseCategoryDto): number {
    return this.monthNums.reduce((s, m) => s + this.catMonthTotal(cat, m), 0);
  }
  catAnnual(cat: ExpenseCategoryDto): number {
    return cat.subcategories.reduce((s, sub) => s + sub.annualPlan, 0);
  }
  catMonthly(cat: ExpenseCategoryDto): number { return this.catAnnual(cat) / 12; }

  subVkupno(sub: ExpenseSubcategoryDto): number {
    return Object.values(sub.amounts).reduce((s, v) => s + v, 0);
  }
  monthlyPlan(sub: ExpenseSubcategoryDto): number {
    return sub.annualPlan ? sub.annualPlan / 12 : 0;
  }
  monthCount(sub: ExpenseSubcategoryDto): number {
    return Object.values(sub.amounts).filter(v => v > 0).length;
  }

  grandTotal(): Record<number, number> {
    const totals: Record<number, number> = {};
    for (const m of this.monthNums) {
      totals[m] = this.data()?.categories.reduce((s, cat) => s + this.catMonthTotal(cat, m), 0) ?? 0;
    }
    return totals;
  }
  grandTotalVkupno(): number { return Object.values(this.grandTotal()).reduce((s, v) => s + v, 0); }
  grandAnnual(): number { return this.data()?.categories.reduce((s, cat) => s + this.catAnnual(cat), 0) ?? 0; }
  grandMonthly(): number { return this.grandAnnual() / 12; }
  grandMonthCount(): number {
    return this.data()?.categories.flatMap(c => c.subcategories).reduce((s, sub) => s + this.monthCount(sub), 0) ?? 0;
  }

  // ── Edit state ─────────────────────────────────────────────────────────────

  isEditing(subId: number, month: number): boolean {
    const c = this.editingCell();
    return c?.subId === subId && c?.month === month;
  }
  isEditingPlan(subId: number): boolean { return this.editingPlanSubId() === subId; }

  startEdit(subId: number, month: number): void {
    this.editingPlanSubId.set(null);
    this.editingCell.set({ subId, month });
    this.focusInput();
  }
  startEditPlan(subId: number): void {
    this.editingCell.set(null);
    this.editingPlanSubId.set(subId);
    this.focusInput();
  }
  private focusInput(): void {
    setTimeout(() => {
      const i = document.querySelector('.cell-input') as HTMLInputElement | null;
      if (i) { i.focus(); i.select(); }
    });
  }

  // ── Saving ─────────────────────────────────────────────────────────────────

  private parseNum(raw: string): number {
    const n = parseFloat((raw ?? '').toString().replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : Math.max(0, Math.round(n));
  }

  private commitMonth(sub: ExpenseSubcategoryDto, month: number, raw: string): void {
    const amount = this.parseNum(raw);
    if (amount === (sub.amounts[month] ?? 0)) return;
    this.service.upsertEntry(sub.id, this.year(), month, amount).subscribe({
      next: () => {
        if (amount > 0) sub.amounts[month] = amount; else delete sub.amounts[month];
        this.data.set({ ...this.data()! });
      },
      error: () => this.notifications.error('Грешка при зачувување.')
    });
  }

  private commitPlan(sub: ExpenseSubcategoryDto, raw: string): void {
    const monthly = this.parseNum(raw);
    const annual = monthly * 12;
    if (annual === sub.annualPlan) return;
    this.service.updateSubcategory(sub.id, sub.categoryId, sub.name, annual).subscribe({
      next: () => { sub.annualPlan = annual; this.data.set({ ...this.data()! }); },
      error: () => this.notifications.error('Грешка при зачувување.')
    });
  }

  onBlurMonth(event: Event, sub: ExpenseSubcategoryDto, month: number): void {
    this.commitMonth(sub, month, (event.target as HTMLInputElement).value);
    if (this.isEditing(sub.id, month)) this.editingCell.set(null);
  }
  onBlurPlan(event: Event, sub: ExpenseSubcategoryDto): void {
    this.commitPlan(sub, (event.target as HTMLInputElement).value);
    if (this.isEditingPlan(sub.id)) this.editingPlanSubId.set(null);
  }

  // ── Keyboard navigation ──────────────────────────────────────────────────
  // Logical columns: 1..12 = months, 13 = monthly-plan (Месечно).

  onKeyMonth(event: KeyboardEvent, sub: ExpenseSubcategoryDto, month: number): void {
    const target = this.resolveTarget(event, sub, month);
    if (target === 'ignore') return;
    event.preventDefault();
    if (target === 'escape') { this.editingCell.set(null); return; }
    this.commitMonth(sub, month, (event.target as HTMLInputElement).value);
    this.activate(target.pos, target.col);
  }

  onKeyPlan(event: KeyboardEvent, sub: ExpenseSubcategoryDto): void {
    const target = this.resolveTarget(event, sub, PLAN_COL);
    if (target === 'ignore') return;
    event.preventDefault();
    if (target === 'escape') { this.editingPlanSubId.set(null); return; }
    this.commitPlan(sub, (event.target as HTMLInputElement).value);
    this.activate(target.pos, target.col);
  }

  private resolveTarget(
    event: KeyboardEvent, sub: ExpenseSubcategoryDto, col: number
  ): { pos: number; col: number } | 'ignore' | 'escape' {
    const input = event.target as HTMLInputElement;
    const pos = this.flatSubs().findIndex(s => s.id === sub.id);
    if (pos < 0) return 'ignore';
    const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
    const atEnd = input.selectionStart === input.value.length;

    switch (event.key) {
      case 'Tab': return this.step(pos, col, event.shiftKey ? -1 : 1);
      case 'Enter':
      case 'ArrowDown': return { pos: pos + 1, col };
      case 'ArrowUp': return { pos: pos - 1, col };
      case 'ArrowLeft': return atStart ? this.step(pos, col, -1) : 'ignore';
      case 'ArrowRight': return atEnd ? this.step(pos, col, 1) : 'ignore';
      case 'Escape': return 'escape';
      default: return 'ignore';
    }
  }

  // Move one logical column left/right, wrapping across rows.
  private step(pos: number, col: number, dir: number): { pos: number; col: number } {
    let c = col + dir;
    if (c < 1) { c = PLAN_COL; pos--; }
    else if (c > PLAN_COL) { c = 1; pos++; }
    return { pos, col: c };
  }

  private activate(pos: number, col: number): void {
    const subs = this.flatSubs();
    if (pos < 0 || pos >= subs.length || col < 1 || col > PLAN_COL) return;
    const sub = subs[pos];
    if (col <= 12) this.startEdit(sub.id, col);
    else this.startEditPlan(sub.id);
  }
}
