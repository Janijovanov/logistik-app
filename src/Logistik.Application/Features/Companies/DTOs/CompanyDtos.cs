namespace Logistik.Application.Features.Companies.DTOs;

public record CompanyDto(int Id, string Name, string HeadquartersAddress, string TaxNumber, string RegistrationNumber, bool IsActive);

public record CreateCompanyRequest(string Name, string HeadquartersAddress, string TaxNumber, string RegistrationNumber);

public record UpdateCompanyRequest(string Name, string HeadquartersAddress, string TaxNumber, string RegistrationNumber, bool IsActive);
