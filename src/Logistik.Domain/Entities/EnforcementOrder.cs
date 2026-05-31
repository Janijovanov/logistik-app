using Logistik.Domain.Common;
using Logistik.Domain.Enums;

namespace Logistik.Domain.Entities;

public class EnforcementOrder : BaseEntity
{
    public int EmployeeId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string ExecutorName { get; set; } = string.Empty;
    public string ExecutorEmail { get; set; } = string.Empty;
    public string ExecutorBankAccount { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public decimal MonthlyDeduction { get; set; }
    public decimal TotalPaid { get; set; }
    public decimal RemainingAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Queued;
    public int QueuePosition { get; set; }
    public DateOnly ReceivedDate { get; set; }
    public DateOnly? CompletedDate { get; set; }
    public bool IsArchived { get; set; }
    public int CreatedByUserId { get; set; }

    public Employee Employee { get; set; } = null!;
    public User CreatedBy { get; set; } = null!;
    public ICollection<EnforcementPayment> Payments { get; set; } = new List<EnforcementPayment>();
    public ICollection<EmployeeSalaryHistory> SalaryDeductions { get; set; } = new List<EmployeeSalaryHistory>();

    public void RecalculateStatus()
    {
        if (RemainingAmount <= 0)
            Status = OrderStatus.Completed;
        else if (RemainingAmount <= MonthlyDeduction)
            Status = OrderStatus.Final;
        else if (Status != OrderStatus.Active && Status != OrderStatus.Queued)
            Status = OrderStatus.Active;
    }
}
