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
        public ActionResult<ResponseModel> Post([FromBody] LoginModel model)
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
                var user = context.Users.First(x => x.UserName == model.UserName);
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
            }

            return Ok(new ResponseModel()
            {
                Message = "Login successful",
                Status = true,
            });
        }
    }
}
