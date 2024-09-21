using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saams.EF.UserManagement
{
    [Table("users")]
    public class User : IEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("user_name")]
        [Required]
        public required string UserName { get; set; }

        [Column("password")]
        [Required]
        public required string Password { get; set; }

        [Column("first_name")]
        [Required]
        public required string FirstName { get; set; }

        [Column("last_name")]
        [Required]
        public required string LastName { get; set; }

        [Column("email")]
        [Required]
        public required string Email { get; set; }

        [Column("phone")]
        [Required]
        public required string Phone { get; set; }

        [Column("sex")]
        [Required]
        public required Sex Sex { get; set; }

        [Column("date_of_birth")]
        [Required]
        public required DateOnly DateOfBirth { get; set; }

        [Column("date_of_joining")]
        [Required]
        public required DateOnly DateOfJoining { get; set; }

        [Column("role_id")]
        [Required]
        public required int RoleId { get; set; }

        [Column("company_id")]
        [Required]
        public required int CompanyId { get; set; }

        [Column("designation_id")]
        [Required]
        public required int DesignationId { get; set; }

        [Column("department_id")]
        [Required]
        public required int DepartmentId { get; set; }

        [Column("shift_id")]
        [Required]
        public required int ShiftId { get; set; }
    }

    public enum Sex
    {
        MALE,
        FEMALE
    }
}
