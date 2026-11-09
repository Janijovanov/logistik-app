using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Logistik.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddExpenseScope : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Scope",
                table: "ExpenseSubcategories",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Scope",
                table: "ExpenseCategories",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Scope",
                table: "ExpenseSubcategories");

            migrationBuilder.DropColumn(
                name: "Scope",
                table: "ExpenseCategories");
        }
    }
}
