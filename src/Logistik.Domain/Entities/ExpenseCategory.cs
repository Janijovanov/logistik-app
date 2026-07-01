using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class ExpenseCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }
    public ICollection<ExpenseSubcategory> Subcategories { get; set; } = new List<ExpenseSubcategory>();
}
