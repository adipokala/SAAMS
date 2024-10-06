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
        public ActionResult<RoleResponseModel> Get()
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

            return Ok(new RoleResponseModel()
            {
                Roles = models,
                Message = "Success",
                Status = true
            });
        }

        [HttpGet("{id}")]
        public ActionResult<RoleResponseModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest(new RoleResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var role = context.Roles.FirstOrDefault(d => d.Id == id);
                if (role != null)
                {
                    return Ok(new RoleResponseModel()
                    {
                        Role = new RoleModel()
                        {
                            Id = role.Id,
                            Code = role.Code,
                            Name = role.Name,
                        },
                        Message = "Success",
                        Status = true
                    });
                }
            }

            return NotFound(new RoleResponseModel()
            {
                Message = "Role not found",
                Status = false
            });
        }

        [HttpPost]
        public ActionResult<RoleModel> Post([FromBody] RoleModel model)
        {
            if (model == null)
            {
                return BadRequest(new RoleResponseModel()
                {
                    Message = "Role model required",
                    Status = false
                });
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

            return Ok(new RoleResponseModel()
            { 
                Role = model,
                Message = "Role created successfully",
                Status = true
            });
        }

        [HttpPut]
        public ActionResult<RoleResponseModel> Put([FromBody] RoleModel model)
        {
            if (model == null)
            {
                return BadRequest(new RoleResponseModel()
                {
                    Message = "Role model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var role = context.Roles.FirstOrDefault(d => d.Id == model.Id);
                if (role == null)
                {
                    return NotFound(new RoleResponseModel()
                    {
                        Message = "Role not found",
                        Status = false
                    });
                }

                role.Code = model.Code;
                role.Name = model.Name;
                context.Roles.Update(role);
                context.SaveChanges();
            }

            return Ok(new RoleResponseModel()
            {
                Role = model,
                Message = "Role updated successfully",
                Status = true
            });
        }

        [HttpDelete("{id}")]
        public ActionResult<RoleResponseModel> Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest(new RoleResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var role = context.Roles.FirstOrDefault(x => x.Id == id);
                if (role == null)
                {
                    return NotFound(new RoleResponseModel()
                    {
                        Message = "Role not found",
                        Status = false
                    });
                }

                context.Roles.Remove(role);
                context.SaveChanges();
            }
            return Ok(new RoleResponseModel()
            {
                Message = "Role deleted successfully",
                Status = true
            });
        }
    }
}
