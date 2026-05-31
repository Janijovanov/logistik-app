using Logistik.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Logistik.Infrastructure.Persistence.Configurations;

public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
{
    public void Configure(EntityTypeBuilder<Employee> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.FullName).HasMaxLength(255).IsRequired();
        builder.Property(e => e.EMBG).HasMaxLength(13).IsRequired();
        builder.Property(e => e.BankAccount).HasMaxLength(50).IsRequired();
        builder.Property(e => e.NetSalary).HasPrecision(15, 2);

        builder.HasIndex(e => e.EMBG).IsUnique();
        builder.HasIndex(e => e.CompanyId);
        builder.HasIndex(e => e.IsDeleted);

        builder.HasQueryFilter(e => !e.IsDeleted);

        builder.HasOne(e => e.Company)
            .WithMany(c => c.Employees)
            .HasForeignKey(e => e.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
