using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class Employee : SoftDeletableEntity
{
    public int CompanyId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string EMBG { get; set; } = string.Empty;
    public DateOnly EmploymentStartDate { get; set; }
    public DateOnly? EmploymentEndDate { get; set; }
    public string BankAccount { get; set; } = string.Empty;
    public decimal NetSalary { get; set; }

    public Company Company { get; set; } = null!;
    public ICollection<EmployeeSalaryHistory> SalaryHistory { get; set; } = new List<EmployeeSalaryHistory>();
    public ICollection<EnforcementOrder> EnforcementOrders { get; set; } = new List<EnforcementOrder>();
    public ICollection<EmploymentHistory> EmploymentHistories { get; set; } = new List<EmploymentHistory>();
}
