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
        public ActionResult<IEnumerable<ShiftModel>> Get()
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
                    };
                    shiftModels.Add(model);
                }
            }

            return Ok(shiftModels);
        }

        [HttpGet("{id}")]
        public ActionResult<ShiftModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var shift = context.Shifts.First(d => d.Id == id);
                if (shift != null)
                {
                    return Ok(
                        new ShiftModel()
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
                        });
                }
            }

            return NotFound();
        }

        [HttpPost]
        public ActionResult<ShiftModel> Post([FromBody] ShiftModel model)
        {
            if (model == null)
            {
                return BadRequest();
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
            }

            return Ok(model);
        }

        [HttpPut]
        public ActionResult Put([FromBody] ShiftModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var shift = context.Shifts.First(d => d.Id == model.Id);
                if (shift == null)
                {
                    return NotFound();
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
                var shift = context.Shifts.First(x => x.Id == id);
                if (shift == null)
                {
                    return NotFound();
                }

                context.Shifts.Remove(shift);
                context.SaveChanges();
            }
            return Ok();
        }
    }
}
