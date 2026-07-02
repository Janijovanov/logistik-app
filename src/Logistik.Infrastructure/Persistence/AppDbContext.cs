using Logistik.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Logistik.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<UserCompanyPermission> UserCompanyPermissions => Set<UserCompanyPermission>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<EmployeeSalaryHistory> EmployeeSalaryHistories => Set<EmployeeSalaryHistory>();
    public DbSet<EnforcementOrder> EnforcementOrders => Set<EnforcementOrder>();
    public DbSet<EnforcementPayment> EnforcementPayments => Set<EnforcementPayment>();
    public DbSet<EmailLog> EmailLogs => Set<EmailLog>();
    public DbSet<Executor> Executors => Set<Executor>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<EmploymentHistory> EmploymentHistories => Set<EmploymentHistory>();
    public DbSet<ExpenseCategory> ExpenseCategories => Set<ExpenseCategory>();
    public DbSet<ExpenseSubcategory> ExpenseSubcategories => Set<ExpenseSubcategory>();
    public DbSet<ExpenseEntry> ExpenseEntries => Set<ExpenseEntry>();
    public DbSet<WorkTimeCompany> WorkTimeCompanies => Set<WorkTimeCompany>();
    public DbSet<WorkDocumentType> WorkDocumentTypes => Set<WorkDocumentType>();
    public DbSet<WorkTimeEntry> WorkTimeEntries => Set<WorkTimeEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }
}
