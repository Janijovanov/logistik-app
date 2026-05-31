using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class EmployeeSalaryHistory : BaseEntity
{
    public int EmployeeId { get; set; }
    public DateOnly SalaryMonth { get; set; }
    public decimal NetSalary { get; set; }
    public decimal DeductionAmount { get; set; }
    public int? EnforcementOrderId { get; set; }
    // Split-payment overflow: when final payment on one order < monthly deduction,
    // the remainder flows to the next queued order in the same month.
    public decimal? OverflowDeductionAmount { get; set; }
    public int? OverflowEnforcementOrderId { get; set; }
    public string? Notes { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    public int RecordedByUserId { get; set; }

    public Employee Employee { get; set; } = null!;
    public EnforcementOrder? EnforcementOrder { get; set; }
    public EnforcementOrder? OverflowEnforcementOrder { get; set; }
    public User RecordedBy { get; set; } = null!;
    public ICollection<EnforcementPayment> Payments { get; set; } = new List<EnforcementPayment>();
}
