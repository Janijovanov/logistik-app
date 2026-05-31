using Logistik.Domain.Enums;

namespace Logistik.Application.Features.EnforcementOrders.DTOs;

public record EnforcementOrderDto(
    int Id, int EmployeeId, string OrderNumber,
    string ExecutorName, string ExecutorEmail, string ExecutorBankAccount,
    decimal TotalAmount, decimal MonthlyDeduction, decimal TotalPaid, decimal RemainingAmount,
    OrderStatus Status, int QueuePosition,
    DateOnly ReceivedDate, DateOnly? CompletedDate, bool IsArchived,
    string StatusColor);

public record EnforcementPaymentDto(
    int Id, int EnforcementOrderId, DateOnly PaymentMonth,
    decimal AmountPaid, decimal RemainingAfterPayment, OrderStatus PaymentStatus);

public record CreateEnforcementOrderRequest(
    string OrderNumber, string ExecutorName, string ExecutorEmail, string ExecutorBankAccount,
    decimal TotalAmount, decimal? MonthlyDeductionOverride, DateOnly ReceivedDate);

public record UpdateEnforcementOrderRequest(
    string OrderNumber, string ExecutorName, string ExecutorEmail, string ExecutorBankAccount,
    decimal TotalAmount, DateOnly ReceivedDate);
