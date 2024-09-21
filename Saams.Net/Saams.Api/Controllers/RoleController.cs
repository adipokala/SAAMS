using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly ILogger<RoleController> logger;

        public RoleController(ILogger<RoleController> logger)
        {
            this.logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<RoleModel>> Get()
        {
            RoleModel model = new RoleModel()
            {
                Id = 1,
                Name = "Administrator",
                Code = "UR1"
            };

            return Ok(model);
        }
    }
}
