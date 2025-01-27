using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.Api.Utils;
using Saams.EF;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger)
        {
            _logger = logger;
        }

        [HttpPost("login")]
        public ActionResult<UserResponseModel> Post([FromBody] LoginModel model)
        {
            if (model == null)
            {
                return BadRequest(new UserResponseModel()
                {
                    Message = "No body",
                    Status = false,
                });
            }

            using (var context = new SaamsContext())
            {
                var user = context.Users.Where(x => x.UserName == model.UserName).FirstOrDefault();
                if (user == null)
                {
                    return NotFound(new UserResponseModel()
                    {
                        Message = "Login failed",
                        Status = false,
                    });
                }

                if (user.Password != AESEncryption.Encrypt(model.Password))
                {
                    return NotFound(new UserResponseModel()
                    {
                        Message = "Login failed",
                        Status = false,
                    });
                }

                return Ok(new UserResponseModel()
                {
                    User = new UserModel()
                    {
                        Id = user.Id,
                        UserNumber = user.UserName,
                        UserName = user.UserName,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Phone = user.Phone,
                        DateOfBirth = user.DateOfBirth,
                        DateOfJoining = user.DateOfJoining,
                        Sex = user.Sex.ToString(),
                        ReportsTo = user.ReportsTo,
                        RoleId = user.RoleId,
                        CompanyId = user.CompanyId,
                        DepartmentId = user.DepartmentId,
                        DesignationId = user.DesignationId,
                        ShiftId = user.ShiftId,
                        Password = string.Empty,
                        CreatedAt = user.CreatedAt,
                        UpdatedAt = user.UpdatedAt,
                    },
                    Message = "Login successful",
                    Status = true,
                });
            }
        }

        [HttpPost("password")]
        public ActionResult<UserResponseModel> Post([FromBody] PasswordModel model)
        {
            if (model == null)
            {
                return BadRequest(new UserResponseModel()
                {
                    Message = "No body",
                    Status = false,
                });
            }

            try
            {
                using (var context = new SaamsContext())
                {
                    var user = context.Users.Where(x => x.UserName == model.UserName).FirstOrDefault();
                    if (user == null)
                    {
                        return NotFound(new UserResponseModel()
                        {
                            Message = "Password update failed",
                            Status = false,
                        });
                    }

                    if (user.Password != AESEncryption.Encrypt(model.CurrentPassword))
                    {
                        return NotFound(new UserResponseModel()
                        {
                            Message = "Password update failed",
                            Status = false,
                        });
                    }

                    user.Password = AESEncryption.Encrypt(model.NewPassword);
                    context.Users.Update(user);
                    context.SaveChanges();

                    return Ok(new UserResponseModel()
                    {
                        User = new UserModel()
                        {
                            Id = user.Id,
                            UserNumber = user.UserName,
                            UserName = user.UserName,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Email = user.Email,
                            Phone = user.Phone,
                            DateOfBirth = user.DateOfBirth,
                            DateOfJoining = user.DateOfJoining,
                            Sex = user.Sex.ToString(),
                            ReportsTo = user.ReportsTo,
                            RoleId = user.RoleId,
                            CompanyId = user.CompanyId,
                            DepartmentId = user.DepartmentId,
                            DesignationId = user.DesignationId,
                            ShiftId = user.ShiftId,
                            Password = string.Empty,
                            CreatedAt = user.CreatedAt,
                            UpdatedAt = user.UpdatedAt,
                        },
                        Message = "Password update successful",
                        Status = true,
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new UserResponseModel()
                    {
                        Message = ex.Message,
                        Status = false
                    });
            }
        }
    }
}
