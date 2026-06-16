using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Logistik.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ResetExistingMonthlyDeductionToNull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Reset all existing enforcement orders to auto mode (null = 1/5 of monthly salary).
            // Previously the value was pre-calculated from the employee's base salary at creation time,
            // which ignored variable monthly salaries. Setting to null triggers the new per-month calculation.
            migrationBuilder.Sql("UPDATE \"EnforcementOrders\" SET \"MonthlyDeduction\" = NULL WHERE \"MonthlyDeduction\" IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Cannot restore original values — intentionally left empty.
        }
    }
}
