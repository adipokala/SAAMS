using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saams.EF.UserManagement
{
    [Table("RolesPrivileges")]
    public class RolePrivilege : IEntity
    {
        public int Id { get; set; }

        [Required]
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;

        [Required]
        public int PrivilegeId { get; set; }
        public Privilege Privilege { get; set; } = null!;
    }
}
