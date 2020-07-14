using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace IssueTracker.Migrations
{
    public partial class ApplicationDBSchema : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            if (migrationBuilder == null)
            {
                throw new ArgumentNullException(nameof(migrationBuilder));
            }

            migrationBuilder.CreateTable(
                name: "MST_CATEGORY",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 6, nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MST_CATEGORY", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MST_TICKET_STATUS",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 6, nullable: false),
                    Name = table.Column<string>(maxLength: 20, nullable: false),
                    Color = table.Column<string>(maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MST_TICKET_STATUS", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MST_USER",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 7, nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Role = table.Column<string>(maxLength: 10, nullable: false),
                    Email = table.Column<string>(maxLength: 256, nullable: false),
                    Password = table.Column<string>(maxLength: 64, nullable: false),
                    Image = table.Column<string>(maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MST_USER", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TR_LOG",
                columns: table => new
                {
                    LogLevel = table.Column<short>(nullable: false),
                    EventId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Message = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "HIS_TRANSACTION",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 32, nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    IpAddress = table.Column<string>(maxLength: 45, nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HIS_TRANSACTION", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HIS_TRANSACTION_MST_USER_UserId",
                        column: x => x.UserId,
                        principalTable: "MST_USER",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TR_TICKET",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 6, nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Description = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    AssigneeId = table.Column<string>(nullable: false),
                    OwnerId = table.Column<string>(nullable: false),
                    CategoryId = table.Column<string>(nullable: false),
                    StatusId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TR_TICKET", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TR_TICKET_MST_USER_AssigneeId",
                        column: x => x.AssigneeId,
                        principalTable: "MST_USER",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TR_TICKET_MST_CATEGORY_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "MST_CATEGORY",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TR_TICKET_MST_USER_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "MST_USER",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TR_TICKET_MST_TICKET_STATUS_StatusId",
                        column: x => x.StatusId,
                        principalTable: "MST_TICKET_STATUS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HIS_CATEGORY",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    TransactionId = table.Column<string>(nullable: false),
                    Seq = table.Column<int>(nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: true),
                    Operation = table.Column<short>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HIS_CATEGORY", x => new { x.TransactionId, x.Id, x.Seq });
                    table.ForeignKey(
                        name: "FK_HIS_CATEGORY_MST_CATEGORY_Id",
                        column: x => x.Id,
                        principalTable: "MST_CATEGORY",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HIS_CATEGORY_HIS_TRANSACTION_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "HIS_TRANSACTION",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HIS_TICKET_STATUS",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    TransactionId = table.Column<string>(nullable: false),
                    Seq = table.Column<int>(nullable: false),
                    Name = table.Column<string>(maxLength: 20, nullable: true),
                    Color = table.Column<string>(maxLength: 10, nullable: true),
                    Operation = table.Column<short>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HIS_TICKET_STATUS", x => new { x.TransactionId, x.Id, x.Seq });
                    table.ForeignKey(
                        name: "FK_HIS_TICKET_STATUS_MST_TICKET_STATUS_Id",
                        column: x => x.Id,
                        principalTable: "MST_TICKET_STATUS",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HIS_TICKET_STATUS_HIS_TRANSACTION_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "HIS_TRANSACTION",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HIS_USER",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    TransactionId = table.Column<string>(nullable: false),
                    Seq = table.Column<int>(nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: true),
                    Role = table.Column<string>(maxLength: 10, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    Operation = table.Column<short>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HIS_USER", x => new { x.TransactionId, x.Id, x.Seq });
                    table.ForeignKey(
                        name: "FK_HIS_USER_MST_USER_Id",
                        column: x => x.Id,
                        principalTable: "MST_USER",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HIS_USER_HIS_TRANSACTION_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "HIS_TRANSACTION",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HIS_TICKET",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    TransactionId = table.Column<string>(nullable: false),
                    Seq = table.Column<int>(nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: true),
                    Description = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    AssigneeId = table.Column<string>(nullable: true),
                    OwnerId = table.Column<string>(nullable: true),
                    CategoryId = table.Column<string>(nullable: true),
                    StatusId = table.Column<string>(nullable: true),
                    Operation = table.Column<short>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HIS_TICKET", x => new { x.TransactionId, x.Id, x.Seq });
                    table.ForeignKey(
                        name: "FK_HIS_TICKET_MST_USER_AssigneeId",
                        column: x => x.AssigneeId,
                        principalTable: "MST_USER",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HIS_TICKET_MST_CATEGORY_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "MST_CATEGORY",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HIS_TICKET_TR_TICKET_Id",
                        column: x => x.Id,
                        principalTable: "TR_TICKET",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HIS_TICKET_MST_USER_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "MST_USER",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HIS_TICKET_MST_TICKET_STATUS_StatusId",
                        column: x => x.StatusId,
                        principalTable: "MST_TICKET_STATUS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HIS_TICKET_HIS_TRANSACTION_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "HIS_TRANSACTION",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HIS_CATEGORY_Id",
                table: "HIS_CATEGORY",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_HIS_TICKET_AssigneeId",
                table: "HIS_TICKET",
                column: "AssigneeId");

            migrationBuilder.CreateIndex(
                name: "IX_HIS_TICKET_CategoryId",
                table: "HIS_TICKET",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_HIS_TICKET_Id",
                table: "HIS_TICKET",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_HIS_TICKET_OwnerId",
                table: "HIS_TICKET",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_HIS_TICKET_StatusId",
                table: "HIS_TICKET",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_HIS_TICKET_STATUS_Id",
                table: "HIS_TICKET_STATUS",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_HIS_TRANSACTION_UserId",
                table: "HIS_TRANSACTION",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_HIS_USER_Id",
                table: "HIS_USER",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "MST_USER_EMAIL_INDEX",
                table: "MST_USER",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "TR_LOG_EVENT_ID_INDEX",
                table: "TR_LOG",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "TR_LOG_LEVEL_INDEX",
                table: "TR_LOG",
                column: "LogLevel");

            migrationBuilder.CreateIndex(
                name: "TR_LOG_NAME_INDEX",
                table: "TR_LOG",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_TR_TICKET_AssigneeId",
                table: "TR_TICKET",
                column: "AssigneeId");

            migrationBuilder.CreateIndex(
                name: "IX_TR_TICKET_CategoryId",
                table: "TR_TICKET",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "TR_TICKET_NAME_INDEX",
                table: "TR_TICKET",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_TR_TICKET_OwnerId",
                table: "TR_TICKET",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_TR_TICKET_StatusId",
                table: "TR_TICKET",
                column: "StatusId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            if (migrationBuilder == null)
            {
                throw new ArgumentNullException(nameof(migrationBuilder));
            }

            migrationBuilder.DropTable(
                name: "HIS_CATEGORY");

            migrationBuilder.DropTable(
                name: "HIS_TICKET");

            migrationBuilder.DropTable(
                name: "HIS_TICKET_STATUS");

            migrationBuilder.DropTable(
                name: "HIS_USER");

            migrationBuilder.DropTable(
                name: "TR_LOG");

            migrationBuilder.DropTable(
                name: "TR_TICKET");

            migrationBuilder.DropTable(
                name: "HIS_TRANSACTION");

            migrationBuilder.DropTable(
                name: "MST_CATEGORY");

            migrationBuilder.DropTable(
                name: "MST_TICKET_STATUS");

            migrationBuilder.DropTable(
                name: "MST_USER");
        }
    }
}
