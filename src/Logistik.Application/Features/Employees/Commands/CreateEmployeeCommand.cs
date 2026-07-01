using Logistik.Application.Common.Models;
using Logistik.Domain.Entities;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Employees.Commands;

public record CreateEmployeeCommand(
    int CompanyId, string FullName, string EMBG,
    DateOnly EmploymentStartDate, DateOnly? EmploymentEndDate,
    string BankAccount, decimal NetSalary,
    int? TransferFromEmployeeId = null,
    string? Code = null) : IRequest<Result<int>>;

public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, Result<int>>
{
    private readonly IUnitOfWork _uow;

    public CreateEmployeeCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result<int>> Handle(CreateEmployeeCommand request, CancellationToken ct)
    {
        var existing = await _uow.Employees.GetByEmbgAsync(request.EMBG, request.CompanyId, ct);

        if (existing is not null)
        {
            // Soft-deleted employee (deleted via the delete button) — just restore them in place
            if (existing.IsDeleted)
            {
                existing.FullName = request.FullName;
                existing.EmploymentStartDate = request.EmploymentStartDate;
                existing.EmploymentEndDate = request.EmploymentEndDate;
                existing.BankAccount = request.BankAccount;
                existing.NetSalary = request.NetSalary;
                if (request.Code is not null) existing.Code = request.Code;
                existing.IsDeleted = false;
                existing.DeletedAt = null;
                existing.UpdatedAt = DateTime.UtcNow;
                _uow.Employees.Update(existing);
                await _uow.SaveChangesAsync(ct);
                return Result<int>.Success(existing.Id);
            }

            if (!existing.EmploymentEndDate.HasValue)
                return Result<int>.Failure("EMBG_ACTIVE");

            // Terminated employee — if user confirmed re-hire, re-activate in place
            if (request.TransferFromEmployeeId == existing.Id)
            {
                // Archive the previous employment period before clearing it
                var history = new Domain.Entities.EmploymentHistory
                {
                    EmployeeId = existing.Id,
                    StartDate = existing.EmploymentStartDate,
                    EndDate = existing.EmploymentEndDate!.Value
                };
                await _uow.EmploymentHistories.AddAsync(history, ct);

                existing.FullName = request.FullName;
                existing.EmploymentStartDate = request.EmploymentStartDate;
                existing.EmploymentEndDate = null;
                existing.BankAccount = request.BankAccount;
                existing.NetSalary = request.NetSalary;
                existing.UpdatedAt = DateTime.UtcNow;
                _uow.Employees.Update(existing);
                await _uow.SaveChangesAsync(ct);
                return Result<int>.Success(existing.Id);
            }

            // Return structured token so frontend can show the re-hire dialog
            return Result<int>.Failure($"TERMINATED:{existing.Id}:{existing.EmploymentEndDate:yyyy-MM-dd}:{existing.FullName}");
        }

        var employee = new Employee
        {
            CompanyId = request.CompanyId,
            Code = request.Code,
            FullName = request.FullName,
            EMBG = request.EMBG,
            EmploymentStartDate = request.EmploymentStartDate,
            EmploymentEndDate = request.EmploymentEndDate,
            BankAccount = request.BankAccount,
            NetSalary = request.NetSalary
        };

        await _uow.Employees.AddAsync(employee, ct);
        await _uow.SaveChangesAsync(ct);
        return Result<int>.Success(employee.Id);
    }
}
