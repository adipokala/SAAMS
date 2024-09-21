using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saams.EF.UserManagement
{
    [Table("companies")]
    public class Company : IEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        [Required]
        public required string Name { get; set; }

        [Column("code")]
        [Required]
        public required string Code { get; set; }

        [Column("address")]
        [Required]
        public required string Address { get; set; }

        [Column("city")]
        [Required]
        public required string City { get; set; }

        [Column("state")]
        [Required]
        public required string State { get; set; }

        [Column("pincode")]
        [Required]
        public required string Pincode { get; set; }

        [Column("email")]
        [Required]
        public required string Email { get; set; }

        [Column("phone")]
        [Required]
        public required string Phone { get; set; }

        [Column("fax")]
        public string? Fax { get; set; }
    }
}
