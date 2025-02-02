namespace Saams.Api.Models
{
    public class LoginModel
    {
        public required string UserName { get; set; }

        public required string Password { get; set; }
    }

    public class PasswordModel
    {
        public required string UserName { get; set; }

        public required string CurrentPassword { get; set; }

        public required string NewPassword { get; set; }
    }
}
