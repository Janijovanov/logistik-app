export interface EmploymentHistory {
  id: number;
  startDate: string;
  endDate: string;
}

export interface Employee {
  id: number;
  companyId: number;
  fullName: string;
  embg: string;
  employmentStartDate: string;
  employmentEndDate: string | null;
  bankAccount: string;
  netSalary: number;
  isDeleted: boolean;
  createdAt: string;
  employmentHistories: EmploymentHistory[];
}

export interface CreateEmployeeRequest {
  fullName: string;
  embg: string;
  employmentStartDate: string;
  employmentEndDate: string | null;
  bankAccount: string;
  netSalary: number;
  transferFromEmployeeId?: number;
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {
  employmentEndDate: string | null;
}

export interface SalaryHistory {
  id: number;
  employeeId: number;
  salaryMonth: string;
  netSalary: number;
  deductionAmount: number;
  enforcementOrderId: number | null;
  orderNumber: string | null;
  executorName: string | null;
  overflowDeductionAmount: number | null;
  overflowEnforcementOrderId: number | null;
  overflowOrderNumber: string | null;
  overflowExecutorName: string | null;
  notes: string | null;
  recordedAt: string;
  recordedByUsername: string;
  remainingAfterDeduction: number | null;
  isFirstPayment: boolean;
}

export interface RecordSalaryRequest {
  salaryMonth: string;
  netSalary: number;
  notes?: string;
}

export interface EmployeeMonthlySalary {
  id: number;
  companyId: number;
  fullName: string;
  embg: string;
  employmentStartDate: string;
  employmentEndDate: string | null;
  bankAccount: string;
  netSalary: number;
  salaryRecordId: number | null;
  recordedNetSalary: number | null;
  deductionAmount: number | null;
  executorName: string | null;
  executorBankAccount: string | null;
  orderNumber: string | null;
}
