namespace Logistik.Application.Features.Employees.DTOs;

public record EmploymentHistoryDto(int Id, DateOnly StartDate, DateOnly EndDate);

public record EmployeeDto(
    int Id, int CompanyId, string FullName, string EMBG,
    DateOnly EmploymentStartDate, DateOnly? EmploymentEndDate,
    string BankAccount, decimal NetSalary, bool IsDeleted,
    IReadOnlyList<EmploymentHistoryDto>? EmploymentHistories = null);

public record CreateEmployeeRequest(
    string FullName, string EMBG,
    DateOnly EmploymentStartDate, DateOnly? EmploymentEndDate,
    string BankAccount, decimal NetSalary,
    int? TransferFromEmployeeId = null);

public record UpdateEmployeeRequest(
    string FullName, string EMBG,
    DateOnly EmploymentStartDate, DateOnly? EmploymentEndDate,
    string BankAccount, decimal NetSalary);

public record EmployeeMonthlySalaryDto(
    int Id, int CompanyId, string FullName, string EMBG,
    DateOnly EmploymentStartDate, DateOnly? EmploymentEndDate,
    string BankAccount, decimal NetSalary,
    // salary record for the requested month (null if not yet recorded)
    int? SalaryRecordId, decimal? RecordedNetSalary, decimal? DeductionAmount,
    // active enforcement order info (from salary record if recorded, else from active order)
    string? ExecutorName = null, string? ExecutorBankAccount = null, string? OrderNumber = null);
