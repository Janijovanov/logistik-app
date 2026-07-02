import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WorkTimeCompanyDto, WorkDocumentTypeDto, WorkTimeEntryDto, WorkTimeUserDto } from '../../core/models/work-time.models';

@Injectable({ providedIn: 'root' })
export class WorkTimeService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/worktime`;

  getCompanies(): Observable<WorkTimeCompanyDto[]> {
    return this.http.get<WorkTimeCompanyDto[]>(`${this.base}/companies`);
  }

  createCompany(name: string): Observable<WorkTimeCompanyDto> {
    return this.http.post<WorkTimeCompanyDto>(`${this.base}/companies`, { name });
  }

  updateCompany(id: number, name: string): Observable<void> {
    return this.http.put<void>(`${this.base}/companies/${id}`, { name });
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/companies/${id}`);
  }

  getDocumentTypes(): Observable<WorkDocumentTypeDto[]> {
    return this.http.get<WorkDocumentTypeDto[]>(`${this.base}/document-types`);
  }

  createDocumentType(name: string): Observable<WorkDocumentTypeDto> {
    return this.http.post<WorkDocumentTypeDto>(`${this.base}/document-types`, { name });
  }

  updateDocumentType(id: number, name: string): Observable<void> {
    return this.http.put<void>(`${this.base}/document-types/${id}`, { name });
  }

  deleteDocumentType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/document-types/${id}`);
  }

  getEntries(date: string, companyId: number, userId?: number): Observable<WorkTimeEntryDto[]> {
    let url = `${this.base}/entries?date=${date}&companyId=${companyId}`;
    if (userId) url += `&userId=${userId}`;
    return this.http.get<WorkTimeEntryDto[]>(url);
  }

  upsertEntry(payload: {
    date: string;
    companyId: number;
    documentTypeId: number;
    documentCount: number;
    minutes: number;
    notes: string | null;
    userId?: number;
  }): Observable<void> {
    return this.http.post<void>(`${this.base}/entries`, payload);
  }

  getEntryDates(companyId: number, userId?: number): Observable<string[]> {
    let url = `${this.base}/entry-dates?companyId=${companyId}`;
    if (userId) url += `&userId=${userId}`;
    return this.http.get<string[]>(url);
  }

  getMonthlyTotal(date: string, companyId: number, userId?: number): Observable<{ documentCount: number; minutes: number }> {
    let url = `${this.base}/monthly-total?date=${date}&companyId=${companyId}`;
    if (userId) url += `&userId=${userId}`;
    return this.http.get<{ documentCount: number; minutes: number }>(url);
  }

  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/entries/${id}`);
  }

  getUsers(): Observable<WorkTimeUserDto[]> {
    return this.http.get<WorkTimeUserDto[]>(`${this.base}/users`);
  }
}
