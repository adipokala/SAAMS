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
        public ActionResult<PrivilegeResponseModel> Get()
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
                        CreatedAt = privilege.CreatedAt,
                        UpdatedAt = privilege.UpdatedAt,
                    };
                    privilegeModels.Add(model);
                }
            }

            return Ok(new PrivilegeResponseModel()
            {
                Privileges = privilegeModels,
                Message = "Success",
                Status = true
            });
        }

        [HttpGet("{id}")]
        public ActionResult<PrivilegeResponseModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest(new PrivilegeResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var privilege = context.Privileges.FirstOrDefault(d => d.Id == id);
                if (privilege != null)
                {
                    return Ok(new PrivilegeResponseModel()
                    {
                        Privilege = new PrivilegeModel()
                        {
                            Id = privilege.Id,
                            Code = privilege.Code,
                            Name = privilege.Name,
                            CreatedAt = privilege.CreatedAt,
                            UpdatedAt = privilege.UpdatedAt,
                        },
                        Message = "Success",
                        Status = true
                    });
                }
            }

            return NotFound(new PrivilegeResponseModel()
            {
                Message = "Privilege not found",
                Status = false
            });
        }

        [HttpPost]
        public ActionResult<PrivilegeModel> Post([FromBody] PrivilegeModel model)
        {
            if (model == null)
            {
                return BadRequest(new PrivilegeResponseModel()
                {
                    Message = "Privilege model required",
                    Status = false
                });
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
                model.CreatedAt = privilege.CreatedAt;
                model.UpdatedAt = privilege.UpdatedAt;
            }

            return Ok(new PrivilegeResponseModel()
            {
                Privilege = model,
                Message = "Privilege created successfully",
                Status = true
            });
        }

        [HttpPut]
        public ActionResult<PrivilegeResponseModel> Put([FromBody] PrivilegeModel model)
        {
            if (model == null)
            {
                return BadRequest(new PrivilegeResponseModel()
                {
                    Message = "Privilege model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var privilege = context.Privileges.FirstOrDefault(d => d.Id == model.Id);
                if (privilege == null)
                {
                    return NotFound(new PrivilegeResponseModel()
                    {
                        Message = "Privilege not found",
                        Status = false
                    });
                }

                privilege.Code = model.Code;
                privilege.Name = model.Name;
                context.Privileges.Update(privilege);
                context.SaveChanges();

                model.CreatedAt = privilege.CreatedAt;
                model.UpdatedAt = privilege.UpdatedAt;
            }

            return Ok(new PrivilegeResponseModel()
            {
                Privilege = model,
                Message = "Privilege updated successfully",
                Status = true
            });
        }

        [HttpDelete("{id}")]
        public ActionResult<PrivilegeResponseModel> Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest(new PrivilegeResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var privilege = context.Privileges.FirstOrDefault(x => x.Id == id);
                if (privilege == null)
                {
                    return NotFound(new PrivilegeResponseModel()
                    {
                        Message = "Privilege not found",
                        Status = false
                    });
                }

                context.Privileges.Remove(privilege);
                context.SaveChanges();
            }
            return Ok(new PrivilegeResponseModel()
            { 
                Message = "Privilege deleted successfully",
                Status = true
            });
        }
    }
}
