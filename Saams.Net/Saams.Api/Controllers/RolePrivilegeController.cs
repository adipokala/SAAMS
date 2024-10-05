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
        public ActionResult<RolePrivilegeResponseModel> Get()
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

            return Ok(new RolePrivilegeResponseModel()
            {
                RolePrivileges = rolePrivilegeModels,
                Message = "Success",
                Status = true
            });
        }

        [HttpGet("{id}")]
        public ActionResult<RolePrivilegeResponseModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest(new RolePrivilegeResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var rolePrivilege = context.RolePrivileges.FirstOrDefault(d => d.Id == id);
                if (rolePrivilege != null)
                {
                    return Ok(new RolePrivilegeResponseModel()
                    {
                        RolePrivilege = new RolePrivilegeModel()
                        {
                            Id = rolePrivilege.Id,
                            RoleId = rolePrivilege.RoleId,
                            PrivilegeId = rolePrivilege.PrivilegeId,
                        },
                        Message = "Success",
                        Status = true
                    });
                }
            }

            return NotFound(new RolePrivilegeResponseModel()
            {
                Message = "Role Privilege not found",
                Status = false
            });
        }

        [HttpPost]
        public ActionResult<RolePrivilegeModel> Post([FromBody] RolePrivilegeModel model)
        {
            if (model == null)
            {
                return BadRequest(new RolePrivilegeResponseModel()
                {
                    Message = "Role Privilege model required",
                    Status = false
                });
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

            return Ok(new RolePrivilegeResponseModel()
            {
                RolePrivilege = model,
                Message = "Role Privilege created successfully",
                Status = true
            });
        }

        [HttpPut]
        public ActionResult<RolePrivilegeResponseModel> Put([FromBody] RolePrivilegeModel model)
        {
            if (model == null)
            {
                return BadRequest(new RolePrivilegeResponseModel()
                {
                    Message = "Role Privilege model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var rolePrivilege = context.RolePrivileges.FirstOrDefault(d => d.Id == model.Id);
                if (rolePrivilege == null)
                {
                    return NotFound(new RolePrivilegeResponseModel()
                    {
                        Message = "Role Privilege not found",
                        Status = false
                    });
                }

                rolePrivilege.PrivilegeId = model.PrivilegeId;
                rolePrivilege.RoleId = model.RoleId;
                context.RolePrivileges.Update(rolePrivilege);
                context.SaveChanges();
            }

            return Ok(new RolePrivilegeResponseModel()
            {
                RolePrivilege = model,
                Message = "Role Privilege updated successfully",
                Status = true
            });
        }

        [HttpDelete("{id}")]
        public ActionResult<RolePrivilegeResponseModel> Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest(new RolePrivilegeResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var rolePrivilege = context.RolePrivileges.FirstOrDefault(x => x.Id == id);
                if (rolePrivilege == null)
                {
                    return NotFound(new RolePrivilegeResponseModel()
                    {
                        Message = "Role Privilege not found",
                        Status = false
                    });
                }

                context.RolePrivileges.Remove(rolePrivilege);
                context.SaveChanges();
            }

            return Ok(new RolePrivilegeResponseModel()
            {
                Message = "Role Privilege deleted successfully",
                Status = true
            });
        }
    }
}
