using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Saams.EF.Migrations
{
    /// <inheritdoc />
    public partial class UserOrganisation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReportsTo",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UserNumber",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReportsTo",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserNumber",
                table: "Users");
        }
    }
}
