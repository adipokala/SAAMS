using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.Api.Utils;
using Saams.EF;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILogger<LoginController> _logger;

        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public ActionResult<UserResponseModel> Post([FromBody] LoginModel model)
        {
            if (model == null)
            {
                return BadRequest(new ResponseModel()
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
                    return NotFound(new ResponseModel()
                    {
                        Message = "Login failed",
                        Status = false,
                    });
                }

                if (user.Password != AESEncryption.Encrypt(model.Password))
                {
                    return NotFound(new ResponseModel()
                    {
                        Message = "Login failed",
                        Status = false,
                    });
                }

                return Ok(new UserResponseModel()
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Phone = user.Phone,
                    DateOfBirth = user.DateOfBirth,
                    DateOfJoining = user.DateOfJoining,
                    Sex = user.Sex.ToString(),
                    RoleId = user.RoleId,
                    CompanyId = user.CompanyId,
                    DepartmentId = user.DepartmentId,
                    DesignationId = user.DesignationId,
                    ShiftId = user.ShiftId,
                    Password = string.Empty,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user?.UpdatedAt,
                    Message = "Login successful",
                    Status = true,
                });
            }
        }
    }
}
