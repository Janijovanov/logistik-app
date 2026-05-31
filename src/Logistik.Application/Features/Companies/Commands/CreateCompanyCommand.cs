using Logistik.Application.Common.Models;
using Logistik.Domain.Entities;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Companies.Commands;

public record CreateCompanyCommand(string Name, string HeadquartersAddress, string TaxNumber, string RegistrationNumber) : IRequest<Result<int>>;

public class CreateCompanyCommandHandler : IRequestHandler<CreateCompanyCommand, Result<int>>
{
    private readonly IUnitOfWork _uow;

    public CreateCompanyCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result<int>> Handle(CreateCompanyCommand request, CancellationToken ct)
    {
        if (await _uow.Companies.TaxNumberExistsAsync(request.TaxNumber, null, ct))
            return Result<int>.Failure("Tax number already registered.");

        if (await _uow.Companies.RegistrationNumberExistsAsync(request.RegistrationNumber, null, ct))
            return Result<int>.Failure("Registration number already registered.");

        var company = new Company
        {
            Name = request.Name,
            HeadquartersAddress = request.HeadquartersAddress,
            TaxNumber = request.TaxNumber,
            RegistrationNumber = request.RegistrationNumber
        };

        await _uow.Companies.AddAsync(company, ct);
        await _uow.SaveChangesAsync(ct);
        return Result<int>.Success(company.Id);
    }
}
