export interface ExpenseSubcategoryDto {
  id: number;
  categoryId: number;
  name: string;
  order: number;
  annualPlan: number;
  amounts: Record<number, number>; // month (1-12) -> amount
}

export interface ExpenseCategoryDto {
  id: number;
  name: string;
  order: number;
  subcategories: ExpenseSubcategoryDto[];
}

export interface ExpensesYearDto {
  year: number;
  categories: ExpenseCategoryDto[];
}
