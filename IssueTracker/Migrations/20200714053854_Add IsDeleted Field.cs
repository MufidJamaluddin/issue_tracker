using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace IssueTracker.Migrations
{
    public partial class AddIsDeletedField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            if (migrationBuilder == null)
            {
                throw new ArgumentNullException(nameof(migrationBuilder));
            }

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "TR_TICKET",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "MST_USER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "MST_TICKET_STATUS",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "MST_CATEGORY",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TR_LOG",
                table: "TR_LOG",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            if (migrationBuilder == null)
            {
                throw new ArgumentNullException(nameof(migrationBuilder));
            }

            migrationBuilder.DropPrimaryKey(
                name: "PK_TR_LOG",
                table: "TR_LOG");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "TR_TICKET");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "MST_USER");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "MST_TICKET_STATUS");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "MST_CATEGORY");
        }
    }
}
