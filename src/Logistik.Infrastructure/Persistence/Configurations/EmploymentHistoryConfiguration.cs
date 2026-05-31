using Logistik.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Logistik.Infrastructure.Persistence.Configurations;

public class EmploymentHistoryConfiguration : IEntityTypeConfiguration<EmploymentHistory>
{
    public void Configure(EntityTypeBuilder<EmploymentHistory> builder)
    {
        builder.HasKey(h => h.Id);
        builder.HasIndex(h => h.EmployeeId);

        builder.HasOne(h => h.Employee)
            .WithMany(e => e.EmploymentHistories)
            .HasForeignKey(h => h.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
