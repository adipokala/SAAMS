using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.EF.UserManagement;
using Saams.EF;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftController : ControllerBase
    {
        private readonly ILogger<ShiftController> _logger;

        public ShiftController(ILogger<ShiftController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<ShiftResponseModel> Get()
        {
            List<ShiftModel> shiftModels = new List<ShiftModel>();

            using (var context = new SaamsContext())
            {
                var shifts = context.Shifts;
                foreach (var shift in shifts)
                {
                    var model = new ShiftModel()
                    {
                        Id = shift.Id,
                        Name = shift.Name,
                        Code = shift.Code,
                        Type = shift.Type.ToString(),
                        EntryTime = shift.EntryTime,
                        GraceEntryTime = shift.GraceEntryTime,
                        ExitLunch = shift.ExitLunch,
                        EntryLunch = shift.EntryLunch,
                        ExitTime = shift.ExitTime,
                        GraceExitTime = shift.GraceExitTime,
                        OverTimeAllowance = shift.OverTimeAllowance,
                        CreatedAt = shift.CreatedAt,
                        UpdatedAt = shift.UpdatedAt,
                    };
                    shiftModels.Add(model);
                }
            }

            return Ok(new ShiftResponseModel()
            {
                Shifts = shiftModels,
                Message = "Success",
                Status = true
            });
        }

        [HttpGet("{id}")]
        public ActionResult<ShiftResponseModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest(new ShiftResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var shift = context.Shifts.FirstOrDefault(d => d.Id == id);
                if (shift != null)
                {
                    return Ok(new ShiftResponseModel()
                    {
                        Shift = new ShiftModel()
                        {
                            Id = shift.Id,
                            Code = shift.Code,
                            Name = shift.Name,
                            Type = shift.Type.ToString(),
                            EntryTime = shift.EntryTime,
                            GraceEntryTime = shift.GraceEntryTime,
                            ExitLunch = shift.ExitLunch,
                            EntryLunch = shift.EntryLunch,
                            ExitTime = shift.ExitTime,
                            GraceExitTime = shift.GraceExitTime,
                            OverTimeAllowance = shift.OverTimeAllowance,
                            CreatedAt = shift.CreatedAt,
                            UpdatedAt = shift.UpdatedAt,
                        },
                        Message = "Success",
                        Status = true
                    });
                }
            }

            return NotFound(new ShiftResponseModel()
            {
                Message = "Shift not found",
                Status = false
            });
        }

        [HttpPost]
        public ActionResult<ShiftResponseModel> Post([FromBody] ShiftModel model)
        {
            if (model == null)
            {
                return BadRequest(new ShiftResponseModel()
                {
                    Message = "Shift model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var shift = new Shift()
                {
                    Name = model.Name,
                    Code = model.Code,
                    Type = (ShiftType)Enum.Parse(typeof(ShiftType), model.Type),
                    EntryTime = model.EntryTime,
                    GraceEntryTime = model.GraceEntryTime,
                    ExitLunch = model.ExitLunch,
                    EntryLunch = model.EntryLunch,
                    ExitTime = model.ExitTime,
                    GraceExitTime = model.GraceExitTime,
                    OverTimeAllowance = model.OverTimeAllowance,
                };

                context.Shifts.Add(shift);
                context.SaveChanges();

                model.Id = shift.Id;
                model.CreatedAt = shift.CreatedAt;
                model.UpdatedAt = shift.UpdatedAt;
            }

            return Ok(new ShiftResponseModel()
            { 
                Shift = model,
                Message = "Shift created successfully",
                Status = true
            });
        }

        [HttpPut]
        public ActionResult<ShiftResponseModel> Put([FromBody] ShiftModel model)
        {
            if (model == null)
            {
                return BadRequest(new ShiftResponseModel()
                {
                    Message = "Shift model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var shift = context.Shifts.FirstOrDefault(d => d.Id == model.Id);
                if (shift == null)
                {
                    return NotFound(new ShiftResponseModel()
                    {
                        Message = "Shift not found",
                        Status = false
                    });
                }

                shift.Code = model.Code;
                shift.Name = model.Name;
                shift.Type = (ShiftType)Enum.Parse(typeof(ShiftType), model.Type);
                shift.EntryTime = model.EntryTime;
                shift.GraceEntryTime = model.GraceEntryTime;
                shift.ExitLunch = model.ExitLunch;
                shift.EntryLunch = model.EntryLunch;
                shift.ExitTime = model.ExitTime;
                shift.GraceExitTime = model.GraceExitTime;
                shift.OverTimeAllowance = model.OverTimeAllowance;
                context.Shifts.Update(shift);
                context.SaveChanges();

                model.CreatedAt = shift.CreatedAt;
                model.UpdatedAt = shift.UpdatedAt;
            }

            return Ok(new ShiftResponseModel()
            {
                Shift = model,
                Message = "Shift updated successfully",
                Status = false
            });
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest(new ShiftResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var shift = context.Shifts.FirstOrDefault(x => x.Id == id);
                if (shift == null)
                {
                    return NotFound(new ShiftResponseModel()
                    {
                        Message = "Shift not found",
                        Status = false
                    });
                }

                context.Shifts.Remove(shift);
                context.SaveChanges();
            }
            return Ok(new ShiftResponseModel()
            {
                Message = "Shift deleted successfully",
                Status = true
            });
        }
    }
}
