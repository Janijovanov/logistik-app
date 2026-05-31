using Logistik.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Logistik.Infrastructure.Persistence.Configurations;

public class EnforcementPaymentConfiguration : IEntityTypeConfiguration<EnforcementPayment>
{
    public void Configure(EntityTypeBuilder<EnforcementPayment> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.AmountPaid).HasPrecision(15, 2);
        builder.Property(p => p.RemainingAfterPayment).HasPrecision(15, 2);
        builder.Property(p => p.Notes).HasMaxLength(500);

        builder.HasIndex(p => p.EnforcementOrderId);
        builder.HasIndex(p => p.SalaryHistoryId);

        builder.HasOne(p => p.EnforcementOrder)
            .WithMany(o => o.Payments)
            .HasForeignKey(p => p.EnforcementOrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.SalaryHistory)
            .WithMany(s => s.Payments)
            .HasForeignKey(p => p.SalaryHistoryId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
