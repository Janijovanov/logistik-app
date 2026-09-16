using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Logistik.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkTimeKind : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Kind",
                table: "WorkTimeEntries",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Kind",
                table: "WorkTimeEntries");
        }
    }
}
