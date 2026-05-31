using Logistik.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Logistik.Infrastructure.Persistence.Configurations;

public class EmployeeSalaryHistoryConfiguration : IEntityTypeConfiguration<EmployeeSalaryHistory>
{
    public void Configure(EntityTypeBuilder<EmployeeSalaryHistory> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.NetSalary).HasPrecision(15, 2);
        builder.Property(s => s.DeductionAmount).HasPrecision(15, 2);
        builder.Property(s => s.OverflowDeductionAmount).HasPrecision(15, 2).IsRequired(false);
        builder.Property(s => s.Notes).HasMaxLength(500);

        builder.HasIndex(s => new { s.EmployeeId, s.SalaryMonth }).IsUnique();
        builder.HasIndex(s => s.EnforcementOrderId);

        builder.HasOne(s => s.Employee)
            .WithMany(e => e.SalaryHistory)
            .HasForeignKey(s => s.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(s => s.EnforcementOrder)
            .WithMany(o => o.SalaryDeductions)
            .HasForeignKey(s => s.EnforcementOrderId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(s => s.OverflowEnforcementOrder)
            .WithMany()
            .HasForeignKey(s => s.OverflowEnforcementOrderId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(s => s.RecordedBy)
            .WithMany()
            .HasForeignKey(s => s.RecordedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
