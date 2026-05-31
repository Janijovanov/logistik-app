using Logistik.Application.Common.Models;
using Logistik.Domain.Exceptions;
using Logistik.Domain.Interfaces;
using MediatR;

namespace Logistik.Application.Features.Companies.Commands;

public record DeleteCompanyCommand(int Id) : IRequest<Result>;

public class DeleteCompanyCommandHandler : IRequestHandler<DeleteCompanyCommand, Result>
{
    private readonly IUnitOfWork _uow;

    public DeleteCompanyCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(DeleteCompanyCommand request, CancellationToken ct)
    {
        var company = await _uow.Companies.GetByIdAsync(request.Id, ct)
            ?? throw new NotFoundException("Company", request.Id);

        company.IsActive = false;
        company.UpdatedAt = DateTime.UtcNow;
        _uow.Companies.Update(company);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
