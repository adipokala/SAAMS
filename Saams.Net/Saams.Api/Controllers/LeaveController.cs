using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.EF.LeaveManagement;
using Saams.EF;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveController : ControllerBase
    {
        private readonly ILogger<LeaveController> _logger;

        public LeaveController(ILogger<LeaveController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<LeaveResponseModel> Get()
        {
            List<LeaveModel> leaveModels = new List<LeaveModel>();

            using (var context = new SaamsContext())
            {
                var leaves = context.Leaves;
                foreach (var leave in leaves)
                {
                    var model = new LeaveModel()
                    {
                        Id = leave.Id,
                        Name = leave.Name,
                        Code = leave.Code,
                        Description = leave.Description,
                        RenewalDate = leave.RenewalDate,
                        AutoRenew = leave.AutoRenew,
                        Validity = leave.Validity,
                        Count = leave.Count,
                    };
                    leaveModels.Add(model);
                }
            }

            return Ok(new LeaveResponseModel()
            {
                Leaves = leaveModels,
                Message = "Success",
                Status = true
            });
        }

        [HttpGet("{id}")]
        public ActionResult<LeaveResponseModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest(new LeaveResponseModel()
                {
                    Message = "Leave model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var leave = context.Leaves.FirstOrDefault(d => d.Id == id);
                if (leave != null)
                {
                    return Ok(new LeaveResponseModel()
                    {
                        Leave = new LeaveModel()
                        {
                            Id = leave.Id,
                            Name = leave.Name,
                            Code = leave.Code,
                            Description = leave.Description,
                            Count = leave.Count,
                            Validity = leave.Validity,
                            AutoRenew= leave.AutoRenew,
                            RenewalDate = leave.RenewalDate,
                        },
                        Message = "Success",
                        Status = true
                    });
                }
            }

            return NotFound(new LeaveResponseModel()
            {
                Message = "Leave not found",
                Status = false
            });
        }

        [HttpPost]
        public ActionResult<LeaveResponseModel> Post([FromBody] LeaveModel model)
        {
            if (model == null)
            {
                return BadRequest(new LeaveResponseModel()
                {
                    Message = "Leave model required",
                    Status = false
                });
            }

            try
            {
                using (var context = new SaamsContext())
                {
                    var leave = new Leave()
                    {
                        Name = model.Name,
                        Code = model.Code,
                        Description = model.Description,
                        Count = model.Count,
                        Validity = model.Validity,
                        AutoRenew = model.AutoRenew,
                        RenewalDate = model.RenewalDate,
                    };

                    context.Leaves.Add(leave);
                    context.SaveChanges();

                    model.Id = leave.Id;
                    model.CreatedAt = leave.CreatedAt;
                    model.UpdatedAt = leave.UpdatedAt;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new LeaveResponseModel()
                    {
                        Message = ex.Message,
                        Status = false
                    });
            }

            return Ok(new LeaveResponseModel()
            {
                Leave = model,
                Message = "Leave created successfully",
                Status = true
            });
        }

        [HttpPut]
        public ActionResult<LeaveResponseModel> Put([FromBody] LeaveModel model)
        {
            if (model == null)
            {
                return BadRequest(new LeaveResponseModel() { Message = "Leave model required", Status = false });
            }

            try
            {
                using (var context = new SaamsContext())
                {
                    var leave = context.Leaves.FirstOrDefault(d => d.Id == model.Id);
                    if (leave == null)
                    {
                        return NotFound(new LeaveResponseModel()
                        {
                            Message = "Leave not found",
                            Status = false,
                        });
                    }

                    leave.Id = model.Id;
                    leave.Name = model.Name;
                    leave.Code = model.Code;
                    leave.Description = model.Description;
                    leave.Count = model.Count;
                    leave.AutoRenew = model.AutoRenew;
                    leave.Validity = model.Validity;
                    leave.RenewalDate = model.RenewalDate;
                    context.Leaves.Update(leave);
                    context.SaveChanges();

                    model.CreatedAt = leave.CreatedAt;
                    model.UpdatedAt = leave.UpdatedAt;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new LeaveResponseModel()
                    {
                        Message = ex.Message,
                        Status = false
                    });
            }

            return Ok(new LeaveResponseModel()
            {
                Leave = model,
                Message = "Leave updated successfully",
                Status = true
            });
        }

        [HttpDelete("{id}")]
        public ActionResult<LeaveResponseModel> Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest(new LeaveResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false,
                });
            }

            using (var context = new SaamsContext())
            {
                var leave = context.Leaves.FirstOrDefault(x => x.Id == id);
                if (leave == null)
                {
                    return NotFound(new LeaveResponseModel()
                    {
                        Message = "Leave not found",
                        Status = false,
                    });
                }

                context.Leaves.Remove(leave);
                context.SaveChanges();
            }
            return Ok(new LeaveResponseModel()
            {
                Message = "Leave successfully deleted",
                Status = true,
            });
        }
    }
}
