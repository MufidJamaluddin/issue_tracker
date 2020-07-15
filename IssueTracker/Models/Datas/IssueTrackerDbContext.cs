using IssueTracker.Models.Datas.Schemas;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Models.Datas
{
    public class IssueTrackerDbContext : DbContext
    {
        public IssueTrackerDbContext(DbContextOptions<IssueTrackerDbContext> options) : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<TicketStatus> TicketStatuses { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Log> Logs { get; set; }


        public DbSet<TableTransaction> Transactions { get; set; }

        public DbSet<UserHistory> UserHistories { get; set; }
        public DbSet<CategoryHistory> CategoryHistories { get; set; }
        public DbSet<TicketStatusHistory> TicketStatusHistories { get; set; }
        public DbSet<TicketHistory> TicketHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            /** M_USER TABLE CREATION **/
            EntityTypeBuilder<User> user = builder?.Entity<User>()
                .ToTable("MST_USER");

            user.HasMany(u => u.UserHistories)
                .WithOne(u => u.User)
                .OnDelete(DeleteBehavior.ClientNoAction);

            user.HasIndex(u => u.Email)
               .IsUnique(true)
               .HasName("MST_USER_EMAIL_INDEX");


            /** M_CATEGORY TABLE CREATION **/
            builder?.Entity<Category>()
                .ToTable("MST_CATEGORY")
                .HasMany(u => u.CategoryHistories)
                .WithOne(u => u.Category)
                .OnDelete(DeleteBehavior.ClientNoAction);


            /** M_TICKET_STATUS TABLE CREATION **/
            builder?.Entity<TicketStatus>()
                .ToTable("MST_TICKET_STATUS")
                .HasMany(u => u.TicketStatusHistories)
                .WithOne(u => u.TicketStatus)
                .OnDelete(DeleteBehavior.ClientNoAction);


            /** TB_R_TICKET TABLE CREATION **/
            EntityTypeBuilder<Ticket> ticket = builder?.Entity<Ticket>()
                .ToTable("TR_TICKET");

            ticket.HasMany(u => u.TicketHistories)
                .WithOne(u => u.Ticket)
                .OnDelete(DeleteBehavior.ClientNoAction);

            ticket.HasIndex(u => u.Name)
                .IsUnique(false)
                .HasName("TR_TICKET_NAME_INDEX");


            /** R_LOG TABLE CREATION **/
            EntityTypeBuilder<Log> log = builder?.Entity<Log>()
                .ToTable("TR_LOG");

            log.Property(u => u.Message)
               .HasColumnType("text");

            log.Property(u => u.LogLevel)
               .HasConversion(new EnumToNumberConverter<LogLevel, short>());

            log.HasIndex(u => u.LogLevel)
               .IsUnique(false)
               .HasName("TR_LOG_LEVEL_INDEX");

            log.HasIndex(u => u.EventId)
               .IsUnique(false)
               .HasName("TR_LOG_EVENT_ID_INDEX");

            log.HasIndex(u => u.Name)
               .IsUnique(false)
               .HasName("TR_LOG_NAME_INDEX");


            /** TRANSACTION TABLE CREATION **/
            EntityTypeBuilder<TableTransaction> trx = builder?.Entity<TableTransaction>().ToTable("HIS_TRANSACTION");

            trx.HasOne(u => u.User)
                .WithMany(u => u.Transactions)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            trx.HasMany(u => u.UserHistories)
                .WithOne(u => u.TableTransaction)
                .HasForeignKey(u => u.TransactionId)
                .OnDelete(DeleteBehavior.Cascade);

            trx.HasMany(u => u.CategoryHistories)
                .WithOne(u => u.TableTransaction)
                .HasForeignKey(u => u.TransactionId)
                .OnDelete(DeleteBehavior.Cascade);

            trx.HasMany(u => u.TicketStatusHistories)
                .WithOne(u => u.TableTransaction)
                .HasForeignKey(u => u.TransactionId)
                .OnDelete(DeleteBehavior.Cascade);

            trx.HasMany(u => u.TicketHistories)
                .WithOne(u => u.TableTransaction)
                .HasForeignKey(u => u.TransactionId)
                .OnDelete(DeleteBehavior.Cascade);


            /** HISTRORY TABLE CREATION **/
            EnumToNumberConverter<TableTransactionOperation, short> transactionOperationConverter
                = new EnumToNumberConverter<TableTransactionOperation, short>();

            EntityTypeBuilder<UserHistory> his_user = builder?.Entity<UserHistory>().ToTable("HIS_USER");

            his_user.HasOne(u => u.TableTransaction)
                .WithMany(u => u.UserHistories)
                .HasForeignKey(u => u.TransactionId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            his_user.HasOne(u => u.User)
                .WithMany(u => u.UserHistories)
                .HasForeignKey(u => u.Id)
                .OnDelete(DeleteBehavior.ClientNoAction)
                .IsRequired();

            his_user.Property(u => u.Operation)
                    .HasConversion(transactionOperationConverter);


            EntityTypeBuilder<CategoryHistory> his_category = builder?.Entity<CategoryHistory>().ToTable("HIS_CATEGORY");

            his_category.HasOne(u => u.TableTransaction)
                .WithMany(u => u.CategoryHistories)
                .HasForeignKey(u => u.TransactionId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            his_category.HasOne(u => u.Category)
                .WithMany(u => u.CategoryHistories)
                .HasForeignKey(u => u.Id)
                .OnDelete(DeleteBehavior.ClientNoAction)
                .IsRequired();

            his_category.Property(u => u.Operation)
                    .HasConversion(transactionOperationConverter);


            EntityTypeBuilder<TicketStatusHistory> his_ticket_status = builder?.Entity<TicketStatusHistory>().ToTable("HIS_TICKET_STATUS");

            his_ticket_status.HasOne(u => u.TableTransaction)
                .WithMany(u => u.TicketStatusHistories)
                .HasForeignKey(u => u.TransactionId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            his_ticket_status.HasOne(u => u.TicketStatus)
                .WithMany(u => u.TicketStatusHistories)
                .HasForeignKey(u => u.Id)
                .OnDelete(DeleteBehavior.ClientNoAction)
                .IsRequired();

            his_ticket_status.Property(u => u.Operation)
                    .HasConversion(transactionOperationConverter);


            EntityTypeBuilder<TicketHistory> his_ticket = builder?.Entity<TicketHistory>().ToTable("HIS_TICKET");

            his_ticket.HasOne(u => u.TableTransaction)
                .WithMany(u => u.TicketHistories)
                .HasForeignKey(u => u.TransactionId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            his_ticket.HasOne(u => u.Ticket)
                .WithMany(u => u.TicketHistories)
                .HasForeignKey(u => u.Id)
                .OnDelete(DeleteBehavior.ClientNoAction)
                .IsRequired();

            his_ticket.Property(u => u.Operation)
                    .HasConversion(transactionOperationConverter);


            List<EntityTypeBuilder> historyTables = new List<EntityTypeBuilder>
            {
                his_user,
                his_category,
                his_ticket_status,
                his_ticket,
            };

            historyTables.ForEach(item =>
            {
                // KEBETULAN SEMUA HISTORY TABLE PK NYA ID, DAN SEQ
                item.HasKey(new string[] { "TransactionId", "Id", "Seq" });
            });
        }
    }
}