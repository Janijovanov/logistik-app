using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Logistik.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkTimeCompanyWorkers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WorkTimeCompanyWorkers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    WorkTimeCompanyId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkTimeCompanyWorkers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkTimeCompanyWorkers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WorkTimeCompanyWorkers_WorkTimeCompanies_WorkTimeCompanyId",
                        column: x => x.WorkTimeCompanyId,
                        principalTable: "WorkTimeCompanies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkTimeCompanyWorkers_UserId",
                table: "WorkTimeCompanyWorkers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkTimeCompanyWorkers_WorkTimeCompanyId",
                table: "WorkTimeCompanyWorkers",
                column: "WorkTimeCompanyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkTimeCompanyWorkers");
        }
    }
}
