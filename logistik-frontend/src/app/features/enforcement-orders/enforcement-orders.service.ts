import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EnforcementOrder, CreateEnforcementOrderRequest, UpdateEnforcementOrderRequest, EnforcementPayment } from '../../core/models/enforcement-order.models';

export interface EmailPreview {
  recipientEmail: string;
  subject: string;
  contentText: string;
  senderName: string;
  isSent: boolean;
  sentAt: string | null;
  errorMessage: string | null;
}

@Injectable({ providedIn: 'root' })
export class EnforcementOrdersService {
  private http = inject(HttpClient);

  private base(companyId: number, employeeId: number): string {
    return `${environment.apiUrl}/companies/${companyId}/employees/${employeeId}/enforcement-orders`;
  }

  getByEmployee(companyId: number, employeeId: number): Observable<EnforcementOrder[]> {
    return this.http.get<EnforcementOrder[]>(`${this.base(companyId, employeeId)}?includeArchived=true`);
  }

  getById(companyId: number, employeeId: number, orderId: number): Observable<EnforcementOrder> {
    return this.http.get<EnforcementOrder>(`${this.base(companyId, employeeId)}/${orderId}`);
  }

  create(companyId: number, employeeId: number, request: CreateEnforcementOrderRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.base(companyId, employeeId), request);
  }

  update(companyId: number, employeeId: number, orderId: number, request: UpdateEnforcementOrderRequest): Observable<void> {
    return this.http.put<void>(`${this.base(companyId, employeeId)}/${orderId}`, request);
  }

  markPaid(companyId: number, employeeId: number, orderId: number): Observable<void> {
    return this.http.post<void>(`${this.base(companyId, employeeId)}/${orderId}/mark-paid`, {});
  }

  getPayments(companyId: number, employeeId: number, orderId: number): Observable<EnforcementPayment[]> {
    return this.http.get<EnforcementPayment[]>(`${this.base(companyId, employeeId)}/${orderId}/payments`);
  }

  getEmailPreview(companyId: number, employeeId: number, orderId: number): Observable<EmailPreview> {
    return this.http.get<EmailPreview>(`${this.base(companyId, employeeId)}/${orderId}/email-preview`);
  }

  sendNotification(companyId: number, employeeId: number, orderId: number, subject: string, bodyText: string): Observable<{ success: boolean; error?: string }> {
    return this.http.post<{ success: boolean; error?: string }>(`${this.base(companyId, employeeId)}/${orderId}/send-notification`, { subject, bodyText });
  }

  resetNotification(companyId: number, employeeId: number, orderId: number): Observable<void> {
    return this.http.post<void>(`${this.base(companyId, employeeId)}/${orderId}/reset-notification`, {});
  }

  deleteOrder(companyId: number, employeeId: number, orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.base(companyId, employeeId)}/${orderId}`);
  }

  exportPdf(orderId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/reports/enforcement-orders/${orderId}/export/pdf`,
      { responseType: 'blob' });
  }

  exportExcel(orderId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/reports/enforcement-orders/${orderId}/export/excel`,
      { responseType: 'blob' });
  }
}
