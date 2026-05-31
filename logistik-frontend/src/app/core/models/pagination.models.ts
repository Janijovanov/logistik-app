export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PageRequest {
  page?: number;
  pageSize?: number;
  search?: string;
}
