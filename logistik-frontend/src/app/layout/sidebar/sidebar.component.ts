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
        <img src="assets/logistik_white_background.png" alt="Logistik" class="logo-img" />
        <span class="logo-text">Logistik</span>
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
      gap: 12px;
      padding: 20px 16px;
    }
    .logo-img {
      width: 36px;
      height: 36px;
      object-fit: contain;
      border-radius: 6px;
    }
    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: #3949ab;
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
  ];

  get visibleItems(): NavItem[] {
    return this.navItems.filter(item =>
      !item.adminOnly || this.authService.isAdmin()
    );
  }
}
