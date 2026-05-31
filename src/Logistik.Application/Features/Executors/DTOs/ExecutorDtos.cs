namespace Logistik.Application.Features.Executors.DTOs;

public record ExecutorDto(int Id, string Name, string Email, string BankAccount);
public record CreateExecutorRequest(string Name, string Email, string BankAccount);
