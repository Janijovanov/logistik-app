import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CompaniesService } from '../companies.service';
import { Company } from '../../../core/models/company.models';
import { AuthService } from '../../../core/services/auth.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmployeeListComponent } from '../../employees/employee-list/employee-list.component';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatTabsModule,
    PageHeaderComponent, EmployeeListComponent
  ],
  template: `
    @if (company()) {
      <app-page-header [title]="company()!.name" subtitle="Company Details">
        <button mat-stroked-button routerLink="/companies">
          <mat-icon>arrow_back</mat-icon>
          Companies
        </button>
        @if (authService.isAdmin()) {
          <button mat-stroked-button [routerLink]="['/companies', companyId, 'edit']">
            <mat-icon>edit</mat-icon>
            Edit
          </button>
        }
      </app-page-header>

      <mat-card class="info-card mb-lg">
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Tax Number (EDB)</span>
              <span class="info-value">{{ company()!.taxNumber }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Registration Number</span>
              <span class="info-value">{{ company()!.registrationNumber }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Address</span>
              <span class="info-value">{{ company()!.headquartersAddress }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status</span>
              <span [class]="company()!.isActive ? 'chip-active' : 'chip-inactive'">
                {{ company()!.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <app-employee-list [companyId]="companyId" />
    }
  `,
  styles: [`
    .info-card { max-width: 900px; }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .info-label { font-size: 12px; color: rgba(0,0,0,0.54); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-value { font-size: 14px; font-weight: 500; }
    .chip-active { background: #e8f5e9; color: #2e7d32; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .chip-inactive { background: #f5f5f5; color: #757575; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
  `]
})
export class CompanyDetailComponent implements OnInit {
  private service = inject(CompaniesService);
  private route = inject(ActivatedRoute);
  authService = inject(AuthService);

  company = signal<Company | null>(null);
  companyId!: number;

  ngOnInit(): void {
    this.companyId = +this.route.snapshot.paramMap.get('companyId')!;
    this.service.getById(this.companyId).subscribe(c => this.company.set(c));
  }
}
