using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LaserTraderApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateContactTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Fax",
                table: "Contacts",
                newName: "Mobile");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Mobile",
                table: "Contacts",
                newName: "Fax");
        }
    }
}
