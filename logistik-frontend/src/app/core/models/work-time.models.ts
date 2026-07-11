export interface WorkTimeCompanyDto {
  id: number;
  name: string;
}

export interface WorkDocumentTypeDto {
  id: number;
  name: string;
  order: number;
}

export interface WorkTimeEntryDto {
  id: number;
  userId: number;
  userName: string;
  workTimeCompanyId: number;
  workDocumentTypeId: number;
  documentTypeName: string;
  documentTypeOrder: number;
  date: string;
  documentCount: number;
  minutes: number;
  notes: string | null;
}

export interface WorkTimeUserDto {
  id: number;
  fullName: string;
}

export interface WorkTimeMonthSummary {
  month: number;
  documentCount: number;
  minutes: number;
}
