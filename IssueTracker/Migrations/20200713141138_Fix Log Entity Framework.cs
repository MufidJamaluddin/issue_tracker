using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IssueTracker.Migrations
{
    public partial class FixLogEntityFramework : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder?.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "TR_LOG",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder?.AddColumn<int>(
                name: "Id",
                table: "TR_LOG",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder?.DropColumn(
                name: "CreatedDate",
                table: "TR_LOG");

            migrationBuilder?.DropColumn(
                name: "Id",
                table: "TR_LOG");
        }
    }
}
