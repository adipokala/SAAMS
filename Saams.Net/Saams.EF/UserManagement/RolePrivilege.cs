using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saams.EF.UserManagement
{
    [Table("roles_privileges")]
    public class RolePrivilege : IEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("role_id")]
        [Required]
        public int RoleId { get; set; }

        [Column("privilege_id")]
        [Required]
        public int PrivilegeId { get; set; }
    }
}
