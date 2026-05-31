using Logistik.Application.Common.Models;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Companies.Commands;

public record UpdateCompanyCommand(int Id, string Name, string HeadquartersAddress, string TaxNumber, string RegistrationNumber, bool IsActive) : IRequest<Result>;

public class UpdateCompanyCommandHandler : IRequestHandler<UpdateCompanyCommand, Result>
{
    private readonly IUnitOfWork _uow;

    public UpdateCompanyCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(UpdateCompanyCommand request, CancellationToken ct)
    {
        var company = await _uow.Companies.GetByIdAsync(request.Id, ct)
            ?? throw new NotFoundException("Company", request.Id);

        if (await _uow.Companies.TaxNumberExistsAsync(request.TaxNumber, request.Id, ct))
            return Result.Failure("Tax number already registered.");

        if (await _uow.Companies.RegistrationNumberExistsAsync(request.RegistrationNumber, request.Id, ct))
            return Result.Failure("Registration number already registered.");

        company.Name = request.Name;
        company.HeadquartersAddress = request.HeadquartersAddress;
        company.TaxNumber = request.TaxNumber;
        company.RegistrationNumber = request.RegistrationNumber;
        company.IsActive = request.IsActive;
        company.UpdatedAt = DateTime.UtcNow;

        _uow.Companies.Update(company);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
