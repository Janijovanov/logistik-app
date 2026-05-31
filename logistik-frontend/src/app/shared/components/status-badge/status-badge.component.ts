import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderStatus } from '../../../core/models/enforcement-order.models';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <span class="status-chip" [ngClass]="cssClass">{{ 'status.' + status | translate }}</span>
  `,
  styles: [`
    .status-chip {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status!: OrderStatus | string;
  @Input() statusColor?: string;

  get cssClass(): string {
    if (this.statusColor) {
      const colorMap: Record<string, string> = {
        'green': 'completed',
        'yellow': 'final',
        'default': 'active'
      };
      return colorMap[this.statusColor] ?? 'active';
    }
    const map: Record<string, string> = {
      'Active': 'active',
      'LastInstallment': 'final',
      'Final': 'final',
      'Completed': 'completed',
      'Queued': 'queued',
      'Archived': 'archived'
    };
    return map[this.status] ?? 'queued';
  }
}
