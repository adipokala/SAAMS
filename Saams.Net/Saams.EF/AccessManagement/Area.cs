using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saams.EF.AccessManagement
{
    [Table("Areas")]
    public class Area : IEntity
    {
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Code { get; set; }

        public ICollection<Reader> Readers { get; set; } = new List<Reader>();
    }
}
