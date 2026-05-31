export type OrderStatus = 'Queued' | 'Active' | 'LastInstallment' | 'Final' | 'Completed' | 'Archived';

export interface EnforcementOrder {
  id: number;
  employeeId: number;
  employeeName: string;
  companyId: number;
  orderNumber: string;
  executorName: string;
  executorEmail: string;
  executorBankAccount: string;
  totalAmount: number;
  monthlyDeduction: number;
  totalPaid: number;
  remainingAmount: number;
  status: OrderStatus;
  statusColor: string;
  queuePosition: number;
  receivedDate: string;
  completedDate: string | null;
  isArchived: boolean;
  createdAt: string;
}

export interface CreateEnforcementOrderRequest {
  orderNumber: string;
  executorName: string;
  executorEmail: string;
  executorBankAccount: string;
  totalAmount: number;
  monthlyDeduction?: number;
  receivedDate: string;
}

export interface UpdateEnforcementOrderRequest extends CreateEnforcementOrderRequest {}

export interface EnforcementPayment {
  id: number;
  enforcementOrderId: number;
  salaryHistoryId: number | null;
  paymentMonth: string;
  amountPaid: number;
  remainingAfterPayment: number;
  paymentStatus: string;
  createdAt: string;
}
