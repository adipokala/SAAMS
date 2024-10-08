﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saams.EF
{
    public abstract class IEntity
    {
        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")] 
        public DateTime? UpdatedAt { get; set; }
    }
}
