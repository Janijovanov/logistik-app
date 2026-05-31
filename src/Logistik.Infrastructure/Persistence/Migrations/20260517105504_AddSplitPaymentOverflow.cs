using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Logistik.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddSplitPaymentOverflow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "OverflowDeductionAmount",
                table: "EmployeeSalaryHistories",
                type: "decimal(15,2)",
                precision: 15,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OverflowEnforcementOrderId",
                table: "EmployeeSalaryHistories",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeSalaryHistories_OverflowEnforcementOrderId",
                table: "EmployeeSalaryHistories",
                column: "OverflowEnforcementOrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeSalaryHistories_EnforcementOrders_OverflowEnforcemen~",
                table: "EmployeeSalaryHistories",
                column: "OverflowEnforcementOrderId",
                principalTable: "EnforcementOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeSalaryHistories_EnforcementOrders_OverflowEnforcemen~",
                table: "EmployeeSalaryHistories");

            migrationBuilder.DropIndex(
                name: "IX_EmployeeSalaryHistories_OverflowEnforcementOrderId",
                table: "EmployeeSalaryHistories");

            migrationBuilder.DropColumn(
                name: "OverflowDeductionAmount",
                table: "EmployeeSalaryHistories");

            migrationBuilder.DropColumn(
                name: "OverflowEnforcementOrderId",
                table: "EmployeeSalaryHistories");
        }
    }
}
