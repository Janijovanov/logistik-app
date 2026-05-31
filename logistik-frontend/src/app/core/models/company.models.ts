export interface Company {
  id: number;
  name: string;
  headquartersAddress: string;
  taxNumber: string;
  registrationNumber: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  headquartersAddress: string;
  taxNumber: string;
  registrationNumber: string;
}

export interface UpdateCompanyRequest extends CreateCompanyRequest {
  isActive: boolean;
}
