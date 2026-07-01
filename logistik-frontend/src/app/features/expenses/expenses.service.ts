import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExpensesYearDto } from '../../core/models/expense.models';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/expenses`;

  getForYear(year: number): Observable<ExpensesYearDto> {
    return this.http.get<ExpensesYearDto>(`${this.base}?year=${year}`);
  }

  createCategory(name: string): Observable<any> {
    return this.http.post(`${this.base}/categories`, { name });
  }

  updateCategory(id: number, name: string): Observable<void> {
    return this.http.put<void>(`${this.base}/categories/${id}`, { name });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/categories/${id}`);
  }

  createSubcategory(categoryId: number, name: string, annualPlan: number): Observable<any> {
    return this.http.post(`${this.base}/subcategories`, { categoryId, name, annualPlan });
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
}
