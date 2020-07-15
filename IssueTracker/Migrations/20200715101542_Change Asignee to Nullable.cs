using Microsoft.EntityFrameworkCore.Migrations;

namespace IssueTracker.Migrations
{
    public partial class ChangeAsigneeTickettoNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder?.AlterColumn<bool>(
                name: "AssigneeId",
                table: "TR_TICKET",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder?.AlterColumn<bool>(
                name: "AssigneeId",
                table: "TR_TICKET",
                nullable: false);
        }
    }
}
