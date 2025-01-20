using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.EF.AccessManagement;
using Saams.EF;
using System.Diagnostics;
using System.Threading.Channels;
using System.Xml.Linq;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReaderController : ControllerBase
    {
        private readonly ILogger<ReaderController> _logger;

        public ReaderController(ILogger<ReaderController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<ReaderResponseModel> Get()
        {
            List<ReaderModel> readerModels = new List<ReaderModel>();

            using (var context = new SaamsContext())
            {
                var readers = context.Readers;
                foreach (var reader in readers)
                {
                    var model = new ReaderModel()
                    {
                        Id = reader.Id,
                        Name = reader.Name,
                        Code = reader.Code,
                        SerialNumber = reader.SerialNumber,
                        InstallationDate = reader.InstallationDate,
                        IsAttendanceReader = reader.IsAttendanceReader,
                        Status = reader.Status,
                        AdminPIN = reader.AdminPIN,
                        DateValidation = reader.DateValidation,
                        AntiPassback = reader.AntiPassback,
                        Biometrics = reader.Biometrics,
                        SIDControl = reader.SIDControl,
                        DoorMode = reader.DoorMode.ToString(),
                        Type = reader.Type.ToString(),
                        AccessControl = reader.AccessControl.ToString(),
                        Switch = reader.Switch.ToString(),
                        Display = reader.Display.ToString(),
                        TransactionLog = reader.TransactionLog.ToString(),
                        UnlockDuration = reader.UnlockDuration,
                        DoorOpenDuration = reader.DoorOpenDuration,
                        DisplayDuration = reader.DisplayDuration,
                        ChannelId = reader.ChannelId,
                        AreaId = reader.AreaId,
                    };
                    readerModels.Add(model);
                }
            }

            return Ok(new ReaderResponseModel()
            {
                Readers = readerModels,
                Message = "Success",
                Status = true
            });
        }

        [HttpGet("{id}")]
        public ActionResult<ReaderResponseModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest(new ReaderResponseModel()
                {
                    Message = "Reader model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var reader = context.Readers.FirstOrDefault(d => d.Id == id);
                if (reader != null)
                {
                    return Ok(new ReaderResponseModel()
                    {
                        Reader = new ReaderModel()
                        {
                            Id = reader.Id,
                            Name = reader.Name,
                            Code = reader.Code,
                            SerialNumber = reader.SerialNumber,
                            InstallationDate = reader.InstallationDate,
                            IsAttendanceReader = reader.IsAttendanceReader,
                            Status = reader.Status,
                            AdminPIN = reader.AdminPIN,
                            DateValidation = reader.DateValidation,
                            AntiPassback = reader.AntiPassback,
                            Biometrics = reader.Biometrics,
                            SIDControl = reader.SIDControl,
                            DoorMode = reader.DoorMode.ToString(),
                            Type = reader.Type.ToString(),
                            AccessControl = reader.AccessControl.ToString(),
                            Switch = reader.Switch.ToString(),
                            Display = reader.Display.ToString(),
                            TransactionLog = reader.TransactionLog.ToString(),
                            UnlockDuration = reader.UnlockDuration,
                            DoorOpenDuration = reader.DoorOpenDuration,
                            DisplayDuration = reader.DisplayDuration,
                            ChannelId = reader.ChannelId,
                            AreaId = reader.AreaId,
                        },
                        Message = "Success",
                        Status = true
                    });
                }
            }

            return NotFound(new ReaderResponseModel()
            {
                Message = "Reader not found",
                Status = false
            });
        }

        [HttpPost]
        public ActionResult<ReaderResponseModel> Post([FromBody] ReaderModel model)
        {
            if (model == null)
            {
                return BadRequest(new ReaderResponseModel()
                {
                    Message = "Reader model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var reader = new Reader()
                {
                    Id = model.Id,
                    Name = model.Name,
                    Code = model.Code,
                    SerialNumber = model.SerialNumber,
                    InstallationDate = model.InstallationDate,
                    IsAttendanceReader = model.IsAttendanceReader,
                    Status = model.Status,
                    AdminPIN = model.AdminPIN,
                    DateValidation = model.DateValidation,
                    AntiPassback = model.AntiPassback,
                    Biometrics = model.Biometrics,
                    SIDControl = model.SIDControl,
                    DoorMode = (DoorMode)Enum.Parse(typeof(DoorMode), model.DoorMode),
                    Type = (ReaderType)Enum.Parse(typeof(ReaderType), model.Type),
                    AccessControl = (AccessControl)Enum.Parse(typeof(AccessControl), model.AccessControl),
                    Switch = (ReaderSwitch)Enum.Parse(typeof(ReaderSwitch), model.Switch),
                    Display = (ReaderDisplay)Enum.Parse(typeof(ReaderDisplay), model.Display),
                    TransactionLog = (TransactionLog)Enum.Parse(typeof(TransactionLog), model.TransactionLog),
                    UnlockDuration = model.UnlockDuration,
                    DoorOpenDuration = model.DoorOpenDuration,
                    DisplayDuration = model.DisplayDuration,
                    ChannelId = model.ChannelId,
                    AreaId = model.AreaId,
                };

                context.Readers.Add(reader);
                context.SaveChanges();

                model.Id = reader.Id;
                model.CreatedAt = reader.CreatedAt;
                model.UpdatedAt = reader.UpdatedAt;
            }

            return Ok(new ReaderResponseModel()
            {
                Reader = model,
                Message = "Reader created successfully",
                Status = true
            });
        }

        [HttpPut]
        public ActionResult<ReaderResponseModel> Put([FromBody] ReaderModel model)
        {
            if (model == null)
            {
                return BadRequest(new ReaderResponseModel() { Message = "Reader model required", Status = false });
            }

            using (var context = new SaamsContext())
            {
                var reader = context.Readers.FirstOrDefault(d => d.Id == model.Id);
                if (reader == null)
                {
                    return NotFound(new ReaderResponseModel()
                    {
                        Message = "Reader not found",
                        Status = false,
                    });
                }

                reader.Id = model.Id;
                reader.Name = model.Name;
                reader.Code = model.Code;
                reader.SerialNumber = model.SerialNumber;
                reader.InstallationDate = model.InstallationDate;
                reader.IsAttendanceReader = model.IsAttendanceReader;
                reader.Status = model.Status;
                reader.AdminPIN = model.AdminPIN;
                reader.DateValidation = model.DateValidation;
                reader.AntiPassback = model.AntiPassback;
                reader.Biometrics = model.Biometrics;
                reader.SIDControl = model.SIDControl;
                reader.DoorMode = (DoorMode)Enum.Parse(typeof(DoorMode), model.DoorMode);
                reader.Type = (ReaderType)Enum.Parse(typeof(ReaderType), model.Type);
                reader.AccessControl = (AccessControl)Enum.Parse(typeof(AccessControl), model.AccessControl);
                reader.Switch = (ReaderSwitch)Enum.Parse(typeof(ReaderSwitch), model.Switch);
                reader.Display = (ReaderDisplay)Enum.Parse(typeof(ReaderDisplay), model.Display);
                reader.TransactionLog = (TransactionLog)Enum.Parse(typeof(TransactionLog), model.TransactionLog);
                reader.UnlockDuration = model.UnlockDuration;
                reader.DoorOpenDuration = model.DoorOpenDuration;
                reader.DisplayDuration = model.DisplayDuration;
                reader.ChannelId = model.ChannelId;
                reader.AreaId = model.AreaId;
                context.Readers.Update(reader);
                context.SaveChanges();

                model.CreatedAt = reader.CreatedAt;
                model.UpdatedAt = reader.UpdatedAt;
            }

            return Ok(new ReaderResponseModel()
            {
                Reader = model,
                Message = "Reader updated successfully",
                Status = true
            });
        }

        [HttpDelete("{id}")]
        public ActionResult<ReaderResponseModel> Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest(new ReaderResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false,
                });
            }

            using (var context = new SaamsContext())
            {
                var reader = context.Readers.FirstOrDefault(x => x.Id == id);
                if (reader == null)
                {
                    return NotFound(new ReaderResponseModel()
                    {
                        Message = "Reader not found",
                        Status = false,
                    });
                }

                context.Readers.Remove(reader);
                context.SaveChanges();
            }
            return Ok(new ReaderResponseModel()
            {
                Message = "Reader successfully deleted",
                Status = true,
            });
        }
    }
}
