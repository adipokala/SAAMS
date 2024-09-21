using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saams.EF.UserManagement
{
    [Table("shifts")]
    public class Shift : IEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        [Required]
        public required string Name { get; set; }

        [Column("code")]
        [Required]
        public required string Code { get; set; }

        [Column("type")]
        [Required]
        public ShiftType Type { get; set; }

        [Column("entry_time")]
        [Required]
        public TimeSpan EntryTime { get; set; }

        [Column("grace_entry_time")]
        [Required]
        public TimeSpan GraceEntryTime { get; set; }

        [Column("exit_lunch")]
        [Required]
        public TimeSpan ExitLunch { get; set; }

        [Column("entry_lunch")]
        [Required]
        public TimeSpan EntryLunch { get; set; }

        [Column("exit_time")]
        [Required]
        public TimeSpan ExitTime { get; set; }

        [Column("grace_exit_time")]
        [Required]
        public TimeSpan GraceExitTime { get; set; }

        [Column("over_time_allowance")]
        [Required]
        public TimeSpan OverTimeAllowance { get; set; }
    }

    public enum ShiftType
    {
        ROTATIONAL,
        NON_ROTATIONAL
    }
}
