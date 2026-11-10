export interface ExpenseSubcategoryDto {
  id: number;
  categoryId: number;
  name: string;
  order: number;
  annualPlan: number;
  scope?: number; // 0 = main (Trošoci), 1 = private
  amounts: Record<number, number>; // month (1-12) -> amount
}

export interface ExpenseCategoryDto {
  id: number;
  name: string;
  order: number;
  scope?: number; // 0 = main (shared), 1 = private-only
  subcategories: ExpenseSubcategoryDto[];
}

export interface ExpensesYearDto {
  year: number;
  categories: ExpenseCategoryDto[];
}
