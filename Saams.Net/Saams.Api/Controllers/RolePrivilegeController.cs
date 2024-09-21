using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.EF.UserManagement;
using Saams.EF;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolePrivilegeController : ControllerBase
    {
        private readonly ILogger<RolePrivilegeController> _logger;

        public RolePrivilegeController(ILogger<RolePrivilegeController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<RolePrivilegeModel>> Get()
        {
            List<RolePrivilegeModel> rolePrivilegeModels = new List<RolePrivilegeModel>();

            using (var context = new SaamsContext())
            {
                var rolePrivileges = context.RolePrivileges;
                foreach (var rolePrivilege in rolePrivileges)
                {
                    var model = new RolePrivilegeModel()
                    {
                        Id = rolePrivilege.Id,
                        RoleId = rolePrivilege.RoleId,
                        PrivilegeId = rolePrivilege.PrivilegeId,
                    };
                    rolePrivilegeModels.Add(model);
                }
            }

            return Ok(rolePrivilegeModels);
        }

        [HttpGet("{id}")]
        public ActionResult<RolePrivilegeModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var rolePrivilege = context.RolePrivileges.First(d => d.Id == id);
                if (rolePrivilege != null)
                {
                    return Ok(
                        new RolePrivilegeModel()
                        {
                            Id = rolePrivilege.Id,
                            RoleId = rolePrivilege.RoleId,
                            PrivilegeId = rolePrivilege.PrivilegeId,
                        });
                }
            }

            return NotFound();
        }

        [HttpPost]
        public ActionResult<RolePrivilegeModel> Post([FromBody] RolePrivilegeModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var rolePrivilege = new RolePrivilege()
                {
                    RoleId = model.RoleId,
                    PrivilegeId = model.PrivilegeId,
                };

                context.RolePrivileges.Add(rolePrivilege);
                context.SaveChanges();

                model.Id = rolePrivilege.Id;
            }

            return Ok(model);
        }

        [HttpPut]
        public ActionResult Put([FromBody] RolePrivilegeModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var rolePrivilege = context.RolePrivileges.First(d => d.Id == model.Id);
                if (rolePrivilege == null)
                {
                    return NotFound();
                }

                rolePrivilege.PrivilegeId = model.PrivilegeId;
                rolePrivilege.RoleId = model.RoleId;
                context.RolePrivileges.Update(rolePrivilege);
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
                var rolePrivilege = context.RolePrivileges.First(x => x.Id == id);
                if (rolePrivilege == null)
                {
                    return NotFound();
                }

                context.RolePrivileges.Remove(rolePrivilege);
                context.SaveChanges();
            }
            return Ok();
        }
    }
}
