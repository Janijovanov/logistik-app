using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Logistik.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixEmbgUniqueIndexPerCompany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Employees_EMBG",
                table: "Employees");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_EMBG_CompanyId",
                table: "Employees",
                columns: new[] { "EMBG", "CompanyId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Employees_EMBG_CompanyId",
                table: "Employees");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_EMBG",
                table: "Employees",
                column: "EMBG",
                unique: true);
        }
    }
}
