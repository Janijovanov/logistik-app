using Logistik.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Logistik.Infrastructure.Persistence.Configurations;

public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Name).HasMaxLength(255).IsRequired();
        builder.Property(c => c.HeadquartersAddress).HasMaxLength(500).IsRequired();
        builder.Property(c => c.TaxNumber).HasMaxLength(50).IsRequired();
        builder.Property(c => c.RegistrationNumber).HasMaxLength(50).IsRequired();

        builder.HasIndex(c => c.TaxNumber).IsUnique();
        builder.HasIndex(c => c.RegistrationNumber).IsUnique();
    }
}
