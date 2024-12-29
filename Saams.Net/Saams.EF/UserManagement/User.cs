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
    [Table("Users")]
    public class User : IEntity
    {
        public int Id { get; set; }

        [Required]
        public required string UserNumber { get; set; }

        [Required]
        public required string UserName { get; set; }

        [Required]
        public required string Password { get; set; }

        [Required]
        public required string FirstName { get; set; }

        [Required]
        public required string LastName { get; set; }

        [Required]
        public required string Email { get; set; }

        [Required]
        public required string Phone { get; set; }

        [Required]
        public required Sex Sex { get; set; }

        [Required]
        public required DateOnly DateOfBirth { get; set; }

        [Required]
        public required DateOnly DateOfJoining { get; set; }

        [Required]
        public required int ReportsTo { get; set; }

        [Required]
        public required int RoleId { get; set; }
        public Role Role { get; set; } = null!;

        [Required]
        public required int CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        [Required]
        public required int DesignationId { get; set; }
        public Designation Designation { get; set; } = null!;

        [Required]
        public required int DepartmentId { get; set; }
        public Department Department { get; set; } = null!;

        [Required]
        public required int ShiftId { get; set; }
        public Shift Shift { get; set; } = null!;
    }

    public enum Sex
    {
        MALE,
        FEMALE
    }
}
