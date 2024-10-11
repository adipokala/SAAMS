using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.EF;
using Saams.EF.UserManagement;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DesignationController : ControllerBase
    {
        private readonly ILogger<DesignationController> _logger;

        public DesignationController(ILogger<DesignationController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<DesignationResponseModel> Get()
        {
            List<DesignationModel> designationModels = new List<DesignationModel>();

            using (var context = new SaamsContext())
            {
                var designations = context.Designations;
                foreach (var designation in designations)
                {
                    var model = new DesignationModel()
                    {
                        Id = designation.Id,
                        Name = designation.Name,
                        Code = designation.Code,
                    };
                    designationModels.Add(model);
                }
            }

            return Ok(new DesignationResponseModel()
            { 
                Designations = designationModels,
                Message = "Success",
                Status = true
            });
        }

        [HttpGet("{id}")]
        public ActionResult<DesignationModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest(new DesignationResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false,
                });
            }

            using (var context = new SaamsContext())
            {
                var designation = context.Designations.FirstOrDefault(d => d.Id == id);
                if (designation != null)
                {
                    return Ok(new DesignationResponseModel()
                    {
                        Designation = new DesignationModel()
                        {
                            Id = designation.Id,
                            Code = designation.Code,
                            Name = designation.Name,
                        },
                        Message = "Success",
                        Status = true
                    });
                }
            }

            return NotFound(new DesignationResponseModel()
            {
                Message = "Designation not found",
                Status = false
            });
        }

        [HttpPost]
        public ActionResult<DesignationModel> Post([FromBody] DesignationModel model)
        {
            if (model == null)
            {
                return BadRequest(new DesignationResponseModel()
                {
                    Message = "Designation model required",
                    Status = false,
                });
            }

            using (var context = new SaamsContext())
            {
                Designation designation = new Designation()
                {
                    Name = model.Name,
                    Code = model.Code,
                };

                context.Designations.Add(designation);
                context.SaveChanges();

                model.Id = designation.Id;
            }

            return Ok(new DesignationResponseModel()
            {
                Designation = model,
                Message = "Designation created successfully",
                Status = true
            });
        }

        [HttpPut]
        public ActionResult Put([FromBody] DesignationModel model)
        {
            if (model == null)
            {
                return BadRequest(new DesignationResponseModel()
                {
                    Message = "Designation model required",
                    Status = false,
                });
            }

            using (var context = new SaamsContext())
            {
                var designation = context.Designations.FirstOrDefault(d => d.Id == model.Id);
                if (designation == null)
                {
                    return NotFound(new DesignationResponseModel()
                    {
                        Message = "Designation not found",
                        Status = false
                    });
                }

                designation.Code = model.Code;
                designation.Name = model.Name;
                context.Designations.Update(designation);
                context.SaveChanges();
            }

            return Ok(new DesignationResponseModel() 
            {
                Designation = model,
                Message = "Designation updated successfully", 
                Status = false 
            });
        }

        [HttpDelete("{id}")]
        public ActionResult<DesignationResponseModel> Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest(new DesignationResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false,
                });
            }

            using (var context = new SaamsContext())
            {
                var designation = context.Designations.FirstOrDefault(x => x.Id == id);
                if (designation == null)
                {
                    return NotFound(new DesignationResponseModel()
                    {
                        Message = "Designation not found",
                        Status = false
                    });
                }

                context.Designations.Remove(designation);
                context.SaveChanges();
            }

            return Ok(new DesignationResponseModel()
            {
                Message = "Designation deleted successfully",
                Status = true
            });
        }
    }
}
