using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.EF;
using Saams.EF.UserManagement;

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
            List<RoleModel> models = new List<RoleModel>();

            using(var context = new SaamsContext())
            {
                var roles = context.Roles;
                foreach (var role in roles)
                {
                    models.Add(new RoleModel()
                    {
                        Id = role.Id,
                        Name = role.Name,
                        Code = role.Code,
                    });
                }
            }

            return Ok(models);
        }

        [HttpGet("{id}")]
        public ActionResult<RoleModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var role = context.Roles.First(d => d.Id == id);
                if (role != null)
                {
                    return Ok(
                        new RoleModel()
                        {
                            Id = role.Id,
                            Code = role.Code,
                            Name = role.Name,
                        });
                }
            }

            return NotFound();
        }

        [HttpPost]
        public ActionResult<RoleModel> Post([FromBody] RoleModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using(var context = new SaamsContext())
            {
                var role = new Role()
                {
                    Name = model.Name,
                    Code = model.Code,
                };

                context.Roles.Add(role);
                context.SaveChanges();

                model.Id = role.Id;
            }

            return Ok(model);
        }

        [HttpPut]
        public ActionResult Put([FromBody] RoleModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var role = context.Roles.First(d => d.Id == model.Id);
                if (role == null)
                {
                    return NotFound();
                }

                role.Code = model.Code;
                role.Name = model.Name;
                context.Roles.Update(role);
                context.SaveChanges();
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var role = context.Roles.First(x => x.Id == id);
                if (role == null)
                {
                    return NotFound();
                }

                context.Roles.Remove(role);
                context.SaveChanges();
            }
            return Ok();
        }
    }
}
