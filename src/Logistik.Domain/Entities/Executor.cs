using Logistik.Domain.Common;

namespace Logistik.Domain.Entities;

public class Executor : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string BankAccount { get; set; } = string.Empty;
}
