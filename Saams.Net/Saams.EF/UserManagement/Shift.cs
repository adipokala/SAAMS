using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saams.EF.UserManagement
{
    [Table("Shifts")]
    public class Shift : IEntity
    {
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Code { get; set; }

        [Required]
        public ShiftType Type { get; set; }

        [Required]
        public TimeSpan EntryTime { get; set; }

        [Required]
        public TimeSpan GraceEntryTime { get; set; }

        [Required]
        public TimeSpan ExitLunch { get; set; }

        [Required]
        public TimeSpan EntryLunch { get; set; }

        [Required]
        public TimeSpan ExitTime { get; set; }

        [Required]
        public TimeSpan GraceExitTime { get; set; }

        [Required]
        public TimeSpan OverTimeAllowance { get; set; }

        public ICollection<User> Users { get; set; } = new List<User>();
    }

    public enum ShiftType
    {
        ROTATIONAL,
        NON_ROTATIONAL
    }
}
