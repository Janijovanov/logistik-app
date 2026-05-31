export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: CurrentUser;
}

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  assignedCompanyIds: number[];
  permissions: CompanyPermission[];
}

export interface CompanyPermission {
  companyId: number;
  companyName: string;
  canView: boolean;
  canEdit: boolean;
  canExport: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
