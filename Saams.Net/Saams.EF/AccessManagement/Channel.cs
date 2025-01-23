using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saams.EF.AccessManagement
{
    [Table("Channels")]
    public class Channel : IEntity
    {
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required] 
        public required string Code { get; set; }

        [Required]
        public required ChannelType Type { get; set; }

        [Required]
        public required string Value { get; set; }

        [Required]
        public required bool LTS { get; set; }

        public ICollection<Reader> Readers { get; set; } = new List<Reader>();
    }

    public enum ChannelType
    {
        TCPIP,
        SERIAL
    }
}
