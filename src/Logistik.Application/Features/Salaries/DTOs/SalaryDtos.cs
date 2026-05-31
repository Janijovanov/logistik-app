namespace Logistik.Application.Features.Salaries.DTOs;

public record SalaryHistoryDto(
    int Id, int EmployeeId, DateOnly SalaryMonth,
    decimal NetSalary, decimal DeductionAmount,
    int? EnforcementOrderId, string? OrderNumber, string? ExecutorName,
    decimal? OverflowDeductionAmount, int? OverflowEnforcementOrderId,
    string? OverflowOrderNumber, string? OverflowExecutorName,
    string? Notes, DateTime RecordedAt, string RecordedByUsername,
    decimal? RemainingAfterDeduction, bool IsFirstPayment);

public record RecordSalaryRequest(DateOnly SalaryMonth, decimal NetSalary, string? Notes);

public record UpdateSalaryRequest(decimal NetSalary, string? Notes);
