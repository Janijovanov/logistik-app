using Logistik.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Logistik.Infrastructure.Persistence.Configurations;

public class EnforcementOrderConfiguration : IEntityTypeConfiguration<EnforcementOrder>
{
    public void Configure(EntityTypeBuilder<EnforcementOrder> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.OrderNumber).HasMaxLength(100).IsRequired();
        builder.Property(o => o.ExecutorName).HasMaxLength(255).IsRequired();
        builder.Property(o => o.ExecutorEmail).HasMaxLength(255).IsRequired();
        builder.Property(o => o.ExecutorBankAccount).HasMaxLength(50).IsRequired();
        builder.Property(o => o.TotalAmount).HasPrecision(15, 2);
        builder.Property(o => o.MonthlyDeduction).HasPrecision(15, 2);
        builder.Property(o => o.TotalPaid).HasPrecision(15, 2);
        builder.Property(o => o.RemainingAmount).HasPrecision(15, 2);

        builder.HasIndex(o => o.EmployeeId);
        builder.HasIndex(o => o.Status);
        builder.HasIndex(o => o.IsArchived);

        builder.HasOne(o => o.Employee)
            .WithMany(e => e.EnforcementOrders)
            .HasForeignKey(o => o.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.CreatedBy)
            .WithMany()
            .HasForeignKey(o => o.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
