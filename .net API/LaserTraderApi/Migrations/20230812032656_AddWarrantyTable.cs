using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LaserTraderApi.Migrations
{
    /// <inheritdoc />
    public partial class AddWarrantyTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Warranties",
                columns: table => new
                {
                    WarrantyId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactId = table.Column<int>(type: "int", nullable: false),
                    Manufacturer = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Model = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Year = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false),
                    Issues = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    ProductImage = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    LastServiceDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastServiceAction = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    RecentServiceUserName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IsUnderWarranty = table.Column<bool>(type: "bit", nullable: false),
                    UnderWarrantyUserName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    WarrantyPlanPeriod = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    WarrantyPlanCost = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PreferredContactMode = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PreferredContactTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Active = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Warranties", x => x.WarrantyId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Warranties");
        }
    }
}
