using Saams.EF.UserManagement;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saams.EF.LeaveManagement
{
    [Table("LeaveCounters")]
    public class LeaveCounter : IEntity
    {
        public int Id { get; set; }

        [Required]
        public required int Counter {  get; set; }

        [Required]
        public DateOnly Expiry {  get; set; }

        [Required]
        public required int UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        public required int LeaveId { get; set; }
        public Leave Leave { get; set; } = null!;
    }
}
