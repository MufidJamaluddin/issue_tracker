using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace IssueTracker.Models.Datas.Schemas
{
    public class User : IBaseModel
    {
        [Key]
        [StringLength(7)]
        public string Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(10)]
        public string Role { get; set; }

        [Required]
        [StringLength(256)]
        // UNIQUE
        public string Email { get; set; }

        [Required]
        [StringLength(64)]
        public string Password { get; set; }

        [StringLength(100)]
        public string Image { get; set; }

        public ICollection<UserHistory> UserHistories { get; set; }

        public ICollection<TableTransaction> Transactions { get; set; }
        public bool IsDeleted { get; set; }
    }
}
