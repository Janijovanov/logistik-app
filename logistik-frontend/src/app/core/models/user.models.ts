export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  permissions: UserCompanyPermission[];
}

export interface CreateUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: number;
}

export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  isActive: boolean;
}

export interface UserCompanyPermission {
  companyId: number;
  companyName: string;
  canView: boolean;
  canEdit: boolean;
  canExport: boolean;
}

export interface AssignPermissionRequest {
  companyId: number;
  canView: boolean;
  canEdit: boolean;
  canExport: boolean;
}
