using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Logistik.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MakeMonthlyDeductionNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "MonthlyDeduction",
                table: "EnforcementOrders",
                type: "decimal(15,2)",
                precision: 15,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(15,2)",
                oldPrecision: 15,
                oldScale: 2);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "MonthlyDeduction",
                table: "EnforcementOrders",
                type: "decimal(15,2)",
                precision: 15,
                scale: 2,
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(15,2)",
                oldPrecision: 15,
                oldScale: 2,
                oldNullable: true);
        }
    }
}
