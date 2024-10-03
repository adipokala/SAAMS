namespace Saams.Api.Models
{
    public class UserModel : BaseModel
    {
        public int Id { get; set; }

        public required string UserName { get; set; }

        public required string Password { get; set; }

        public required string FirstName { get; set; }

        public required string LastName { get; set; }

        public required string Email { get; set; }

        public required string Phone { get; set; }

        public required string Sex { get; set; }

        public required DateOnly DateOfBirth { get; set; }

        public required DateOnly DateOfJoining { get; set; }

        public required int RoleId { get; set; }

        public required int CompanyId { get; set; }

        public required int DesignationId { get; set; }

        public required int DepartmentId { get; set; }

        public required int ShiftId { get; set; }
    }

    public class UserResponseModel : UserModel
    {
        public required string Message { get; set; }

        public bool Status { get; set; }
    }
}
