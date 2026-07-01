import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { ExpensesService } from '../expenses.service';
import { ExpenseCategoryDto, ExpensesYearDto } from '../../../core/models/expense.models';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatExpansionModule, MatDividerModule
  ],
  template: `
    <h2 mat-dialog-title>Управување со категории</h2>
    <mat-dialog-content style="min-width:520px;max-height:70vh;overflow-y:auto">

      @for (cat of categories(); track cat.id) {
        <div class="category-block">
          <div class="category-header">
            @if (editingCatId() === cat.id) {
              <mat-form-field appearance="outline" class="inline-field">
                <input matInput [(ngModel)]="editCatName" (keydown.enter)="saveCategory(cat)" (keydown.escape)="editingCatId.set(null)" />
              </mat-form-field>
              <button mat-icon-button color="primary" (click)="saveCategory(cat)"><mat-icon>check</mat-icon></button>
              <button mat-icon-button (click)="editingCatId.set(null)"><mat-icon>close</mat-icon></button>
            } @else {
              <strong class="cat-name">{{ cat.name }}</strong>
              <button mat-icon-button (click)="startEditCat(cat)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="deleteCategory(cat)"><mat-icon>delete</mat-icon></button>
            }
          </div>

          <div class="subcategory-list">
            @for (sub of cat.subcategories; track sub.id) {
              <div class="sub-row">
                @if (editingSubId() === sub.id) {
                  <mat-form-field appearance="outline" class="inline-field sub-name-field">
                    <mat-label>Назив</mat-label>
                    <input matInput [(ngModel)]="editSubName" (keydown.escape)="editingSubId.set(null)" />
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="inline-field plan-field">
                    <mat-label>Годишен план</mat-label>
                    <input matInput type="number" [(ngModel)]="editSubPlan" (keydown.escape)="editingSubId.set(null)" />
                  </mat-form-field>
                  <button mat-icon-button color="primary" (click)="saveSub(cat, sub)"><mat-icon>check</mat-icon></button>
                  <button mat-icon-button (click)="editingSubId.set(null)"><mat-icon>close</mat-icon></button>
                } @else {
                  <span class="sub-name">{{ sub.name }}</span>
                  <span class="sub-plan">{{ sub.annualPlan | number:'1.0-0' }} ден.</span>
                  <button mat-icon-button (click)="startEditSub(sub)"><mat-icon>edit</mat-icon></button>
                  <button mat-icon-button color="warn" (click)="deleteSub(cat, sub)"><mat-icon>delete</mat-icon></button>
                }
              </div>
            }

            <!-- Add subcategory row -->
            @if (addingSubForCatId() === cat.id) {
              <div class="sub-row add-row">
                <mat-form-field appearance="outline" class="inline-field sub-name-field">
                  <mat-label>Назив на поткатегорија</mat-label>
                  <input matInput [(ngModel)]="newSubName" (keydown.escape)="addingSubForCatId.set(null)" />
                </mat-form-field>
                <mat-form-field appearance="outline" class="inline-field plan-field">
                  <mat-label>Годишен план (ден.)</mat-label>
                  <input matInput type="number" [(ngModel)]="newSubPlan" />
                </mat-form-field>
                <button mat-icon-button color="primary" (click)="confirmAddSub(cat)"><mat-icon>check</mat-icon></button>
                <button mat-icon-button (click)="addingSubForCatId.set(null)"><mat-icon>close</mat-icon></button>
              </div>
            } @else {
              <button mat-button (click)="startAddSub(cat.id)" class="add-sub-btn">
                <mat-icon>add</mat-icon> Додади поткатегорија
              </button>
            }
          </div>
        </div>
        <mat-divider />
      }

      <!-- Add category -->
      @if (addingCat()) {
        <div class="add-cat-row">
          <mat-form-field appearance="outline" class="inline-field" style="flex:1">
            <mat-label>Назив на категорија</mat-label>
            <input matInput [(ngModel)]="newCatName" (keydown.enter)="confirmAddCat()" (keydown.escape)="addingCat.set(false)" />
          </mat-form-field>
          <button mat-icon-button color="primary" (click)="confirmAddCat()"><mat-icon>check</mat-icon></button>
          <button mat-icon-button (click)="addingCat.set(false)"><mat-icon>close</mat-icon></button>
        </div>
      } @else {
        <button mat-stroked-button color="primary" class="add-cat-btn" (click)="addingCat.set(true)">
          <mat-icon>add</mat-icon> Додади категорија
        </button>
      }

    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button color="primary" [mat-dialog-close]="changed()">Затвори</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .category-block { padding: 12px 0 8px; }
    .category-header { display: flex; align-items: center; gap: 4px; margin-bottom: 8px; }
    .cat-name { font-size: 15px; flex: 1; }
    .subcategory-list { padding-left: 16px; }
    .sub-row { display: flex; align-items: center; gap: 4px; padding: 2px 0; }
    .sub-name { flex: 1; font-size: 14px; }
    .sub-plan { width: 120px; text-align: right; font-size: 13px; color: rgba(0,0,0,0.6); }
    .inline-field { margin-bottom: -1.25em; }
    .sub-name-field { flex: 1; }
    .plan-field { width: 160px; }
    .add-sub-btn { color: rgba(0,0,0,0.5); font-size: 13px; margin-top: 4px; }
    .add-cat-row { display: flex; align-items: center; gap: 4px; margin-top: 16px; }
    .add-cat-btn { margin-top: 16px; }
    .add-row { background: rgba(0,0,0,0.02); border-radius: 4px; padding: 4px; }
  `]
})
export class CategoryManagerComponent implements OnInit {
  private service = inject(ExpensesService);
  private notifications = inject(NotificationService);
  private dialog = inject(MatDialog);
  dialogRef = inject(MatDialogRef<CategoryManagerComponent>);

  categories = signal<ExpenseCategoryDto[]>([]);
  changed = signal(false);

  editingCatId = signal<number | null>(null);
  editCatName = '';
  editingSubId = signal<number | null>(null);
  editSubName = '';
  editSubPlan = 0;
  addingCat = signal(false);
  newCatName = '';
  addingSubForCatId = signal<number | null>(null);
  newSubName = '';
  newSubPlan = 0;

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.service.getForYear(new Date().getFullYear()).subscribe({
      next: data => this.categories.set(data.categories),
      error: () => {}
    });
  }

  startEditCat(cat: ExpenseCategoryDto): void {
    this.editingCatId.set(cat.id);
    this.editCatName = cat.name;
  }

  saveCategory(cat: ExpenseCategoryDto): void {
    if (!this.editCatName.trim()) return;
    this.service.updateCategory(cat.id, this.editCatName.trim()).subscribe({
      next: () => {
        cat.name = this.editCatName.trim();
        this.editingCatId.set(null);
        this.changed.set(true);
      },
      error: () => this.notifications.error('Грешка при зачувување.')
    });
  }

  deleteCategory(cat: ExpenseCategoryDto): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Избриши категорија',
        message: `Дали сте сигурни дека сакате да ја избришете категоријата "${cat.name}"?\nСите поткатегории и трошоци ќе бидат трајно избришани.`,
        confirmText: 'Избриши', warn: true
      }
    }).afterClosed().subscribe(ok => {
      if (!ok) return;
      this.service.deleteCategory(cat.id).subscribe({
        next: () => {
          this.categories.update(cats => cats.filter(c => c.id !== cat.id));
          this.changed.set(true);
        },
        error: () => this.notifications.error('Грешка при бришење.')
      });
    });
  }

  confirmAddCat(): void {
    if (!this.newCatName.trim()) return;
    this.service.createCategory(this.newCatName.trim()).subscribe({
      next: (created) => {
        this.categories.update(cats => [...cats, { ...created, subcategories: [] }]);
        this.newCatName = '';
        this.addingCat.set(false);
        this.changed.set(true);
      },
      error: () => this.notifications.error('Грешка при додавање.')
    });
  }

  startEditSub(sub: any): void {
    this.editingSubId.set(sub.id);
    this.editSubName = sub.name;
    this.editSubPlan = sub.annualPlan;
  }

  saveSub(cat: ExpenseCategoryDto, sub: any): void {
    if (!this.editSubName.trim()) return;
    this.service.updateSubcategory(sub.id, cat.id, this.editSubName.trim(), this.editSubPlan).subscribe({
      next: () => {
        sub.name = this.editSubName.trim();
        sub.annualPlan = this.editSubPlan;
        this.editingSubId.set(null);
        this.changed.set(true);
      },
      error: () => this.notifications.error('Грешка при зачувување.')
    });
  }

  deleteSub(cat: ExpenseCategoryDto, sub: any): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Избриши поткатегорија',
        message: `Дали сте сигурни дека сакате да ја избришете поткатегоријата "${sub.name}"?\nСите трошоци за оваа поткатегорија ќе бидат избришани.`,
        confirmText: 'Избриши', warn: true
      }
    }).afterClosed().subscribe(ok => {
      if (!ok) return;
      this.service.deleteSubcategory(sub.id).subscribe({
        next: () => {
          cat.subcategories = cat.subcategories.filter((s: any) => s.id !== sub.id);
          this.changed.set(true);
          this.categories.set([...this.categories()]);
        },
        error: () => this.notifications.error('Грешка при бришење.')
      });
    });
  }

  startAddSub(catId: number): void {
    this.addingSubForCatId.set(catId);
    this.newSubName = '';
    this.newSubPlan = 0;
  }

  confirmAddSub(cat: ExpenseCategoryDto): void {
    if (!this.newSubName.trim()) return;
    this.service.createSubcategory(cat.id, this.newSubName.trim(), this.newSubPlan).subscribe({
      next: (created) => {
        cat.subcategories = [...cat.subcategories, { ...created, amounts: {} }];
        this.newSubName = '';
        this.newSubPlan = 0;
        this.addingSubForCatId.set(null);
        this.changed.set(true);
        this.categories.set([...this.categories()]);
      },
      error: () => this.notifications.error('Грешка при додавање.')
    });
  }
}
