import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-export-buttons',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <button mat-stroked-button [matMenuTriggerFor]="exportMenu" [disabled]="disabled">
      <mat-icon>download</mat-icon>
      Export
    </button>
    <mat-menu #exportMenu="matMenu">
      <button mat-menu-item (click)="exportPdf.emit()">
        <mat-icon>picture_as_pdf</mat-icon>
        Export PDF
      </button>
      <button mat-menu-item (click)="exportExcel.emit()">
        <mat-icon>table_view</mat-icon>
        Export Excel
      </button>
    </mat-menu>
  `
})
export class ExportButtonsComponent {
  @Input() disabled = false;
  @Output() exportPdf = new EventEmitter<void>();
  @Output() exportExcel = new EventEmitter<void>();
}
