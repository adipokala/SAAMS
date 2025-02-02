﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saams.EF.LeaveManagement
{
    [Table("Leaves")]
    public class Leave : IEntity
    {
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Code { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        public required int Count { get; set; }

        public ICollection<UserLeave> UserLeaves { get; set; } = new List<UserLeave>();
    }
}
