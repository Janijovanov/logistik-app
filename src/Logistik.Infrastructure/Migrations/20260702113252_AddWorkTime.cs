using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Logistik.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WorkDocumentTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkDocumentTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WorkTimeCompanies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkTimeCompanies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WorkTimeEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    WorkTimeCompanyId = table.Column<int>(type: "integer", nullable: false),
                    WorkDocumentTypeId = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    DocumentCount = table.Column<int>(type: "integer", nullable: false),
                    Minutes = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkTimeEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkTimeEntries_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WorkTimeEntries_WorkDocumentTypes_WorkDocumentTypeId",
                        column: x => x.WorkDocumentTypeId,
                        principalTable: "WorkDocumentTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WorkTimeEntries_WorkTimeCompanies_WorkTimeCompanyId",
                        column: x => x.WorkTimeCompanyId,
                        principalTable: "WorkTimeCompanies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkTimeEntries_UserId",
                table: "WorkTimeEntries",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkTimeEntries_WorkDocumentTypeId",
                table: "WorkTimeEntries",
                column: "WorkDocumentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkTimeEntries_WorkTimeCompanyId",
                table: "WorkTimeEntries",
                column: "WorkTimeCompanyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkTimeEntries");

            migrationBuilder.DropTable(
                name: "WorkDocumentTypes");

            migrationBuilder.DropTable(
                name: "WorkTimeCompanies");
        }
    }
}
