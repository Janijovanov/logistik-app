import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExpensesYearDto } from '../../core/models/expense.models';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/expenses`;

  getForYear(year: number, scope = 0): Observable<ExpensesYearDto> {
    return this.http.get<ExpensesYearDto>(`${this.base}?year=${year}&scope=${scope}`);
  }

  createCategory(name: string, scope = 0): Observable<any> {
    return this.http.post(`${this.base}/categories`, { name, scope });
  }

  updateCategory(id: number, name: string): Observable<void> {
    return this.http.put<void>(`${this.base}/categories/${id}`, { name });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/categories/${id}`);
  }

  createSubcategory(categoryId: number, name: string, annualPlan: number, scope = 0): Observable<any> {
    return this.http.post(`${this.base}/subcategories`, { categoryId, name, annualPlan, scope });
  }

  updateSubcategory(id: number, categoryId: number, name: string, annualPlan: number): Observable<void> {
    return this.http.put<void>(`${this.base}/subcategories/${id}`, { categoryId, name, annualPlan });
  }

  deleteSubcategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/subcategories/${id}`);
  }

  upsertEntry(subcategoryId: number, year: number, month: number, amount: number): Observable<void> {
    return this.http.put<void>(`${this.base}/entries`, { subcategoryId, year, month, amount });
  }

  exportExcel(year: number, scope = 0): Observable<Blob> {
    return this.http.get(`${this.base}/export?year=${year}&scope=${scope}`, { responseType: 'blob' });
  }
}
