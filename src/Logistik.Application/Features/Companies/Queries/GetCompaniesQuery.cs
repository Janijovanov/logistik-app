using Logistik.Application.Common.Interfaces;
using Logistik.Application.Common.Models;
using Logistik.Application.Features.Companies.DTOs;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Companies.Queries;

public record GetCompaniesQuery(int Page = 1, int PageSize = 20, string? Search = null) : IRequest<PaginatedResult<CompanyDto>>;

public class GetCompaniesQueryHandler : IRequestHandler<GetCompaniesQuery, PaginatedResult<CompanyDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly ICurrentUserService _currentUser;

    public GetCompaniesQueryHandler(IUnitOfWork uow, ICurrentUserService currentUser)
    {
        _uow = uow;
        _currentUser = currentUser;
    }

    public async Task<PaginatedResult<CompanyDto>> Handle(GetCompaniesQuery request, CancellationToken ct)
    {
        IEnumerable<int>? allowedIds = _currentUser.IsAdmin ? null : _currentUser.AssignedCompanyIds;
        var (items, total) = await _uow.Companies.GetPagedAsync(request.Page, request.PageSize, request.Search, allowedIds, ct);

        return new PaginatedResult<CompanyDto>
        {
            Items = items.Select(c => new CompanyDto(c.Id, c.Name, c.HeadquartersAddress, c.TaxNumber, c.RegistrationNumber, c.IsActive)).ToList(),
            TotalCount = total,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}
