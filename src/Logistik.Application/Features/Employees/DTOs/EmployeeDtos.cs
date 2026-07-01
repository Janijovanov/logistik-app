namespace Logistik.Application.Features.Employees.DTOs;

public record EmploymentHistoryDto(int Id, DateOnly StartDate, DateOnly EndDate);

public record EmployeeDto(
    int Id, int CompanyId, string FullName, string EMBG,
    DateOnly EmploymentStartDate, DateOnly? EmploymentEndDate,
    string BankAccount, decimal NetSalary, bool IsDeleted,
    IReadOnlyList<EmploymentHistoryDto>? EmploymentHistories = null,
    string? Code = null);

public record CreateEmployeeRequest(
    string FullName, string EMBG,
    DateOnly EmploymentStartDate, DateOnly? EmploymentEndDate,
    string BankAccount, decimal NetSalary,
    int? TransferFromEmployeeId = null,
    string? Code = null);

public record UpdateEmployeeRequest(
    string FullName, string EMBG,
    DateOnly EmploymentStartDate, DateOnly? EmploymentEndDate,
    string BankAccount, decimal NetSalary);

public record EmployeeMonthlySalaryDto(
    int Id, int CompanyId, string FullName, string EMBG,
    DateOnly EmploymentStartDate, DateOnly? EmploymentEndDate,
    string BankAccount, decimal NetSalary,
    int? SalaryRecordId, decimal? RecordedNetSalary, decimal? DeductionAmount,
    string? ExecutorName = null, string? ExecutorBankAccount = null, string? OrderNumber = null,
    string? Code = null);
