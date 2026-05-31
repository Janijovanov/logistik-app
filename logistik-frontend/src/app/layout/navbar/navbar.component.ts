import { Component, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ChangePasswordDialogComponent } from '../../features/auth/change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule, MatDialogModule, TranslateModule],
  template: `
    <mat-toolbar class="navbar">
      <button mat-icon-button (click)="menuToggle.emit()">
        <mat-icon>menu</mat-icon>
      </button>

      <span class="flex-1"></span>

      <!-- Language switcher -->
      <div class="lang-switcher">
        <button
          mat-button
          class="lang-btn"
          [class.lang-active]="currentLang === 'mk'"
          (click)="setLang('mk')"
        >MK</button>
        <button
          mat-button
          class="lang-btn"
          [class.lang-active]="currentLang === 'en'"
          (click)="setLang('en')"
        >EN</button>
      </div>

      <button mat-icon-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
      </button>

      <mat-menu #userMenu="matMenu">
        <div class="user-menu-header">
          @if (authService.currentUser(); as user) {
            <div class="font-medium">{{ user.firstName }} {{ user.lastName }}</div>
            <div class="text-muted text-sm">{{ user.email }}</div>
          }
        </div>
        <mat-divider />
        <button mat-menu-item (click)="openChangePassword()">
          <mat-icon>lock_reset</mat-icon>
          {{ 'auth.changePassword' | translate }}
        </button>
        <button mat-menu-item (click)="authService.logout()">
          <mat-icon>logout</mat-icon>
          {{ 'nav.logout' | translate }}
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      background: white;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .user-menu-header {
      padding: 12px 16px;
    }
    mat-divider { margin: 4px 0; }
    .lang-switcher {
      display: flex;
      align-items: center;
      gap: 2px;
      margin-right: 8px;
    }
    .lang-btn {
      min-width: 36px;
      padding: 0 8px;
      font-size: 12px;
      font-weight: 600;
      color: rgba(0,0,0,0.45);
      border-radius: 6px;
    }
    .lang-active {
      color: #3949ab;
      background: rgba(57,73,171,0.1);
    }
  `]
})
export class NavbarComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();
  authService = inject(AuthService);
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);

  currentLang = 'mk';

  ngOnInit(): void {
    const saved = localStorage.getItem('lang') ?? 'mk';
    this.currentLang = saved;
    this.translate.use(saved);
  }

  setLang(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  openChangePassword(): void {
    this.dialog.open(ChangePasswordDialogComponent, { width: '420px' });
  }
}
