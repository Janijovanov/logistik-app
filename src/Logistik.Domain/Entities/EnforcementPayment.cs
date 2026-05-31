using Logistik.Domain.Common;
using Logistik.Domain.Enums;

namespace Logistik.Domain.Entities;

public class EnforcementPayment : BaseEntity
{
    public int EnforcementOrderId { get; set; }
    public int? SalaryHistoryId { get; set; }
    public DateOnly PaymentMonth { get; set; }
    public decimal AmountPaid { get; set; }
    public decimal RemainingAfterPayment { get; set; }
    public OrderStatus PaymentStatus { get; set; }
    public string? Notes { get; set; }

    public EnforcementOrder EnforcementOrder { get; set; } = null!;
    public EmployeeSalaryHistory? SalaryHistory { get; set; }
}
