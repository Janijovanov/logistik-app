using Logistik.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Logistik.Infrastructure.Persistence.Configurations;

public class UserCompanyPermissionConfiguration : IEntityTypeConfiguration<UserCompanyPermission>
{
    public void Configure(EntityTypeBuilder<UserCompanyPermission> builder)
    {
        builder.HasKey(p => p.Id);
        builder.HasIndex(p => new { p.UserId, p.CompanyId }).IsUnique();
        builder.HasIndex(p => p.CompanyId);

        builder.HasOne(p => p.User)
            .WithMany(u => u.CompanyPermissions)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Company)
            .WithMany(c => c.UserPermissions)
            .HasForeignKey(p => p.CompanyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.AssignedBy)
            .WithMany()
            .HasForeignKey(p => p.AssignedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
