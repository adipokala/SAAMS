using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.EF.UserManagement;
using Saams.EF;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrivilegeController : ControllerBase
    {
        private readonly ILogger<PrivilegeController> _logger;

        public PrivilegeController(ILogger<PrivilegeController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<PrivilegeModel>> Get()
        {
            List<PrivilegeModel> privilegeModels = new List<PrivilegeModel>();

            using (var context = new SaamsContext())
            {
                var privileges = context.Privileges;
                foreach (var privilege in privileges)
                {
                    var model = new PrivilegeModel()
                    {
                        Id = privilege.Id,
                        Name = privilege.Name,
                        Code = privilege.Code,
                    };
                    privilegeModels.Add(model);
                }
            }

            return Ok(privilegeModels);
        }

        [HttpGet("{id}")]
        public ActionResult<PrivilegeModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var privilege = context.Privileges.First(d => d.Id == id);
                if (privilege != null)
                {
                    return Ok(
                        new PrivilegeModel()
                        {
                            Id = privilege.Id,
                            Code = privilege.Code,
                            Name = privilege.Name,
                        });
                }
            }

            return NotFound();
        }

        [HttpPost]
        public ActionResult<PrivilegeModel> Post([FromBody] PrivilegeModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var privilege = new Privilege()
                {
                    Name = model.Name,
                    Code = model.Code,
                };

                context.Privileges.Add(privilege);
                context.SaveChanges();

                model.Id = privilege.Id;
            }

            return Ok(model);
        }

        [HttpPut]
        public ActionResult Put([FromBody] PrivilegeModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var privilege = context.Privileges.First(d => d.Id == model.Id);
                if (privilege == null)
                {
                    return NotFound();
                }

                privilege.Code = model.Code;
                privilege.Name = model.Name;
                context.Privileges.Update(privilege);
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
                var privilege = context.Privileges.First(x => x.Id == id);
                if (privilege == null)
                {
                    return NotFound();
                }

                context.Privileges.Remove(privilege);
                context.SaveChanges();
            }
            return Ok();
        }
    }
}
