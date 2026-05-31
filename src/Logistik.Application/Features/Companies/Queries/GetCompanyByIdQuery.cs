using Logistik.Application.Features.Companies.DTOs;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Companies.Queries;

public record GetCompanyByIdQuery(int Id) : IRequest<CompanyDto>;

public class GetCompanyByIdQueryHandler : IRequestHandler<GetCompanyByIdQuery, CompanyDto>
{
    private readonly IUnitOfWork _uow;
    public GetCompanyByIdQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<CompanyDto> Handle(GetCompanyByIdQuery request, CancellationToken ct)
    {
        var c = await _uow.Companies.GetByIdAsync(request.Id, ct)
            ?? throw new NotFoundException("Company", request.Id);
        return new CompanyDto(c.Id, c.Name, c.HeadquartersAddress, c.TaxNumber, c.RegistrationNumber, c.IsActive);
    }
}
