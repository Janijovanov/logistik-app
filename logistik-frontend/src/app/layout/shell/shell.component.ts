import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, SidebarComponent, NavbarComponent],
  template: `
    <mat-sidenav-container class="shell-container">
      <mat-sidenav
        #sidenav
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile() || sidenavOpen()"
        [fixedInViewport]="true"
        class="sidenav"
      >
        <app-sidebar (navItemClick)="isMobile() && sidenav.close()" />
      </mat-sidenav>

      <mat-sidenav-content class="main-content">
        <app-navbar (menuToggle)="sidenav.toggle()" />
        <main class="page-content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .shell-container {
      height: 100vh;
    }
    .sidenav {
      width: 260px;
      border-right: none;
      box-shadow: 2px 0 8px rgba(0,0,0,0.08);
    }
    .main-content {
      display: flex;
      flex-direction: column;
    }
    .page-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }
    @media (max-width: 768px) {
      .page-content { padding: 12px; }
    }
  `]
})
export class ShellComponent {
  private breakpoint = inject(BreakpointObserver);

  isMobile = toSignal(
    this.breakpoint.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(
      map(result => result.matches)
    ),
    { initialValue: false }
  );

  sidenavOpen = signal(false);
}
