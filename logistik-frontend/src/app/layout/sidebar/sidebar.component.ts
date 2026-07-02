import { Component, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  labelKey: string;
  icon: string;
  route: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatDividerModule, TranslateModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">
          <img src="assets/logistik_white_background.png" alt="Logistik" class="logo-img" />
        </div>
        <div class="logo-names">
          <span class="logo-text">{{ 'nav.brandName' | translate }}</span>
          <span class="logo-sub">{{ 'nav.brandTag' | translate }}</span>
        </div>
      </div>

      <mat-divider />

      <mat-nav-list class="nav-list">
        @for (item of visibleItems; track item.route) {
          <a
            mat-list-item
            [routerLink]="item.route"
            routerLinkActive="active-link"
            (click)="navItemClick.emit()"
          >
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle>{{ item.labelKey | translate }}</span>
          </a>
        }
      </mat-nav-list>

      <div class="sidebar-footer">
        <div class="user-info" *ngIf="authService.currentUser() as user">
          <mat-icon>account_circle</mat-icon>
          <div>
            <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
            <div class="user-role text-muted text-sm">{{ user.role }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
    }
    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 22px 20px;
      background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
    }
    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.15);
      border-radius: 10px;
      flex-shrink: 0;

    }
    .logo-img {
      width: 28px;
      height: 28px;
      object-fit: contain;
      border-radius: 4px;
    }
    .logo-names {
      display: flex;
      flex-direction: column;
      line-height: 1;
      gap: 3px;
    }
    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: white;
      letter-spacing: 0.3px;
    }
    .logo-sub {
      font-size: 9.5px;
      font-weight: 400;
      color: rgba(255,255,255,0.65);
      letter-spacing: 0.5px;
      font-family: 'Martel', 'Georgia', serif;
    }
    .nav-list {
      flex: 1;
      padding-top: 8px;
    }
    .active-link {
      background-color: rgba(92, 107, 192, 0.12);
      color: #3949ab;
      border-radius: 8px;

      mat-icon { color: #3949ab; }
    }
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(0,0,0,0.08);
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;

      mat-icon { color: rgba(0,0,0,0.38); font-size: 32px; width: 32px; height: 32px; }
    }
    .user-name {
      font-weight: 500;
      font-size: 14px;
    }
  `]
})
export class SidebarComponent {
  @Output() navItemClick = new EventEmitter<void>();
  authService = inject(AuthService);

  private navItems: NavItem[] = [
    { labelKey: 'nav.companies', icon: 'business', route: '/companies' },
    { labelKey: 'nav.users', icon: 'manage_accounts', route: '/users', adminOnly: true },
    { labelKey: 'nav.expenses', icon: 'receipt_long', route: '/expenses', adminOnly: true },
  ];

  get visibleItems(): NavItem[] {
    return this.navItems.filter(item =>
      !item.adminOnly || this.authService.isAdmin()
    );
  }
}
