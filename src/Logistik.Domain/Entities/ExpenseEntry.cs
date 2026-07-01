using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class ExpenseEntry : BaseEntity
{
    public int SubcategoryId { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal Amount { get; set; }
    public ExpenseSubcategory Subcategory { get; set; } = null!;
}
