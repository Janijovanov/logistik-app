import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, SalaryHistory, RecordSalaryRequest, EmployeeMonthlySalary } from '../../core/models/employee.models';
import { PaginatedResult } from '../../core/models/pagination.models';

export interface ImportSalariesResult {
  imported: number;
  alreadyRecorded: number;
  notFound: string[];
}

export interface TerminationEmailPreview {
  emailLogId: number | null;
  orderId: number;
  executorName: string;
  executorEmail: string;
  orderNumber: string;
  subject: string;
  contentText: string;
  senderName: string;
  isSent: boolean;
  sentAt: string | null;
  errorMessage: string | null;
}

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private http = inject(HttpClient);

  private base(companyId: number): string {
    return `${environment.apiUrl}/companies/${companyId}/employees`;
  }

  getMonthlySalary(companyId: number, year: number, month: number): Observable<EmployeeMonthlySalary[]> {
    const params = new HttpParams().set('year', year).set('month', month).set('_t', Date.now());
    return this.http.get<EmployeeMonthlySalary[]>(`${this.base(companyId)}/monthly`, { params });
  }

  getAll(companyId: number, page = 1, pageSize = 20, search = ''): Observable<PaginatedResult<Employee>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize).set('search', search);
    return this.http.get<PaginatedResult<Employee>>(this.base(companyId), { params });
  }

  getById(companyId: number, id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.base(companyId)}/${id}`);
  }

  create(companyId: number, request: CreateEmployeeRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.base(companyId), request);
  }

  update(companyId: number, id: number, request: UpdateEmployeeRequest): Observable<void> {
    return this.http.put<void>(`${this.base(companyId)}/${id}`, request);
  }

  delete(companyId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.base(companyId)}/${id}`);
  }

  getSalaryHistory(companyId: number, employeeId: number, page = 1, pageSize = 12): Observable<import('../../core/models/pagination.models').PaginatedResult<SalaryHistory>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<import('../../core/models/pagination.models').PaginatedResult<SalaryHistory>>(`${this.base(companyId)}/${employeeId}/salary-history`, { params });
  }

  recordSalary(companyId: number, employeeId: number, request: RecordSalaryRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.base(companyId)}/${employeeId}/salary-history`, request);
  }

  updateSalary(companyId: number, employeeId: number, recordId: number, request: { netSalary: number; notes?: string }): Observable<void> {
    return this.http.put<void>(`${this.base(companyId)}/${employeeId}/salary-history/${recordId}`, request);
  }

  exportPdf(companyId: number, employeeId: number, lang = 'mk'): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/reports/employees/${employeeId}/export/pdf?lang=${lang}`,
      { responseType: 'blob' });
  }

  exportExcel(companyId: number, employeeId: number, lang = 'mk'): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/reports/employees/${employeeId}/export/excel?lang=${lang}`,
      { responseType: 'blob' });
  }

  exportAllExcel(companyId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/reports/companies/${companyId}/employees/export/excel`,
      { responseType: 'blob' });
  }

  exportEnforcementDeductionsExcel(companyId: number, year: number, month: number): Observable<Blob> {
    return this.http.get(
      `${environment.apiUrl}/reports/companies/${companyId}/enforcement-deductions/export/excel?year=${year}&month=${month}`,
      { responseType: 'blob' });
  }

  downloadPaymentOrder(salaryRecordId: number, overflow = false): Observable<Blob> {
    const params = overflow ? '?overflow=true' : '';
    return this.http.get(`${environment.apiUrl}/reports/salary-history/${salaryRecordId}/payment-order${params}`,
      { responseType: 'blob' });
  }

  importSalaries(companyId: number, year: number, month: number, file: File): Observable<ImportSalariesResult> {
    const formData = new FormData();
    formData.append('file', file);
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http.post<ImportSalariesResult>(`${this.base(companyId)}/salary-import`, formData, { params });
  }

  getTerminationEmails(companyId: number, employeeId: number): Observable<TerminationEmailPreview[]> {
    return this.http.get<TerminationEmailPreview[]>(`${this.base(companyId)}/${employeeId}/termination-emails`);
  }

  sendTerminationEmail(companyId: number, employeeId: number, emailLogId: number, subject?: string, bodyText?: string): Observable<{ success: boolean; error: string | null }> {
    return this.http.post<{ success: boolean; error: string | null }>(
      `${this.base(companyId)}/${employeeId}/termination-emails/${emailLogId}/send`,
      { subject, bodyText }
    );
  }

  resetTerminationEmail(companyId: number, employeeId: number, emailLogId: number): Observable<void> {
    return this.http.post<void>(`${this.base(companyId)}/${employeeId}/termination-emails/${emailLogId}/reset`, {});
  }
}
