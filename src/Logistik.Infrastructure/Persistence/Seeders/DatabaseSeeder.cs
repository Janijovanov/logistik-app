using Logistik.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Logistik.Infrastructure.Persistence.Seeders;

public class DatabaseSeeder
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(AppDbContext context, IConfiguration config, ILogger<DatabaseSeeder> logger)
    {
        _context = context;
        _config = config;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        await _context.Database.MigrateAsync();
        await SeedRolesAsync();
        await SeedAdminUserAsync();
        await SeedWorkDocumentTypesAsync();
    }

    private async Task SeedRolesAsync()
    {
        if (await _context.Roles.AnyAsync()) return;

        _context.Roles.AddRange(
            new Role { Name = "Admin", Description = "System administrator" },
            new Role { Name = "User", Description = "Regular user" }
        );
        await _context.SaveChangesAsync();
        _logger.LogInformation("Roles seeded.");
    }

    private async Task SeedAdminUserAsync()
    {
        if (await _context.Users.AnyAsync()) return;

        var adminRole = await _context.Roles.FirstAsync(r => r.Name == "Admin");
        var adminUser = new User
        {
            Username = _config["Seed:AdminUsername"] ?? "admin",
            Email = _config["Seed:AdminEmail"] ?? "admin@logistik.mk",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(_config["Seed:AdminPassword"] ?? "Admin123!", 12),
            FirstName = "System",
            LastName = "Admin",
            RoleId = adminRole.Id,
            IsActive = true
        };

        _context.Users.Add(adminUser);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Admin user seeded.");
    }

    private async Task SeedWorkDocumentTypesAsync()
    {
        if (await _context.WorkDocumentTypes.AnyAsync()) return;

        var types = new[]
        {
            "ВФ за трошоци",
            "ВФ за тргoвија на големо-дома",
            "ВФ за тргoвија на големо-увоз",
            "ИФ за трг. на големо-дома",
            "ИФ за трг. на големо-извоз",
            "КАЛ. на мало од магацин",
            "ПР. по попис",
            "Сметка во продавница",
            "ИФ во продавница",
            "ПОВР. Од продавница",
            "ИС. во пр-во",
            "ПР. во пр-во",
            "ИС. За премин во магацин",
            "ИФ за услуга-извоз",
            "ИФ за лон",
            "КАСА-прими",
            "КАСА-исплати",
            "ДНЕВ. На благајна",
            "ПАТНИ налози",
            "ПД евиденција",
            "ГК. налози"
        };

        for (int i = 0; i < types.Length; i++)
        {
            _context.WorkDocumentTypes.Add(new WorkDocumentType
            {
                Name = types[i],
                Order = i + 1,
                IsActive = true
            });
        }

        await _context.SaveChangesAsync();
        _logger.LogInformation("Work document types seeded.");
    }
}
