import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from '../../core/models/company.models';
import { PaginatedResult } from '../../core/models/pagination.models';

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/companies`;

  getAll(page = 1, pageSize = 20, search = ''): Observable<PaginatedResult<Company>> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('search', search);
    return this.http.get<PaginatedResult<Company>>(this.base, { params });
  }

  getAllForDropdown(): Observable<Company[]> {
    const params = new HttpParams().set('page', 1).set('pageSize', 1000);
    return this.http.get<PaginatedResult<Company>>(this.base, { params })
      .pipe(map(r => r.items));
  }

  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.base}/${id}`);
  }

  create(request: CreateCompanyRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.base, request);
  }

  update(id: number, request: UpdateCompanyRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
