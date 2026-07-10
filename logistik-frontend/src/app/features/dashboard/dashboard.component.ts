import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

interface DashboardStats {
  totalCompanies: number;
  totalEmployees: number;
  activeOrders: number;
  pendingOrders: number;
  totalDeductionsThisMonth: number;
  ordersCompletedThisMonth: number;
}

interface StatCard {
  labelKey: string;
  value: string | number;
  icon: string;
  color: string;
  route?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, TranslateModule],
  template: `
    <div class="dashboard">
      <div class="welcome-header">
        <div>
          <h1 class="page-title">{{ 'dashboard.title' | translate }}</h1>
          <p class="text-muted">{{ 'dashboard.welcome' | translate: {name: authService.currentUser()?.firstName} }}</p>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <mat-spinner diameter="40" />
        </div>
      } @else {
        <div class="stats-grid">
          @for (card of statCards(); track card.labelKey) {
            <mat-card class="stat-card" [routerLink]="card.route" [class.clickable]="!!card.route">
              <mat-card-content>
                <div class="stat-content">
                  <div class="stat-icon" [style.background]="card.color + '20'">
                    <mat-icon [style.color]="card.color">{{ card.icon }}</mat-icon>
                  </div>
                  <div class="stat-text">
                    <div class="stat-value">{{ card.value }}</div>
                    <div class="stat-label text-muted">{{ card.labelKey | translate }}</div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      }

      <div class="quick-actions mt-lg">
        <h2 class="section-title">{{ 'dashboard.quickActions' | translate }}</h2>
        <div class="actions-grid">
          <button mat-stroked-button routerLink="/companies">
            <mat-icon>business</mat-icon>
            {{ 'dashboard.manageCompanies' | translate }}
          </button>
          @if (authService.isAdmin()) {
            <button mat-stroked-button routerLink="/users">
              <mat-icon>manage_accounts</mat-icon>
              {{ 'dashboard.manageUsers' | translate }}
            </button>
          }
          <button mat-stroked-button routerLink="/reports">
            <mat-icon>assessment</mat-icon>
            {{ 'dashboard.reports' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1200px; }
    .welcome-header { margin-bottom: 24px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }
    .stat-card {
      border-radius: 12px !important;
      transition: transform 150ms ease, box-shadow 150ms ease;

      &.clickable {
        cursor: pointer;
        &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.12) !important; }
      }
    }
    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon { font-size: 26px; width: 26px; height: 26px; }
    }
    .stat-value {
      font-size: 26px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 4px;
    }
    .stat-label { font-size: 13px; }
    .loading-state {
      display: flex;
      justify-content: center;
      padding: 60px;
    }
    .section-title { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
    .actions-grid {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;

      button { gap: 8px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private http = inject(HttpClient);

  loading = signal(true);
  statCards = signal<StatCard[]>([]);

  ngOnInit(): void {
    this.http.get<DashboardStats>(`${environment.apiUrl}/reports/dashboard`).subscribe({
      next: (stats) => {
        this.statCards.set([
          { labelKey: 'dashboard.totalCompanies', value: stats.totalCompanies, icon: 'business', color: '#3949ab', route: '/companies' },
          { labelKey: 'dashboard.activeEmployees', value: stats.totalEmployees, icon: 'people', color: '#0288d1' },
          { labelKey: 'dashboard.activeOrders', value: stats.activeOrders, icon: 'gavel', color: '#f57c00' },
          { labelKey: 'dashboard.queuedOrders', value: stats.pendingOrders, icon: 'queue', color: '#7b1fa2' },
          { labelKey: 'dashboard.deductionsThisMonth', value: this.formatCurrency(stats.totalDeductionsThisMonth), icon: 'payments', color: '#e53935' },
          { labelKey: 'dashboard.ordersCompleted', value: stats.ordersCompletedThisMonth, icon: 'check_circle', color: '#388e3c' },
        ]);
        this.loading.set(false);
      },
      error: () => {
        this.statCards.set([
          { labelKey: 'dashboard.companies', value: '-', icon: 'business', color: '#3949ab', route: '/companies' },
          { labelKey: 'dashboard.employees', value: '-', icon: 'people', color: '#0288d1' },
          { labelKey: 'dashboard.activeOrders', value: '-', icon: 'gavel', color: '#f57c00' },
          { labelKey: 'dashboard.queuedOrders', value: '-', icon: 'queue', color: '#7b1fa2' },
        ]);
        this.loading.set(false);
      }
    });
  }

  private formatCurrency(value: number): string {
    return formatNumber(Math.round(value), 'mk', '1.0-0') + ' ден.';
  }
}
