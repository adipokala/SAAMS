using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.EF.AccessManagement;
using Saams.EF;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelController : ControllerBase
    {
        private readonly ILogger<ChannelController> _logger;

        public ChannelController(ILogger<ChannelController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<ChannelResponseModel> Get()
        {
            List<ChannelModel> ChannelModels = new List<ChannelModel>();

            using (var context = new SaamsContext())
            {
                var channels = context.Channels;
                foreach (var channel in channels)
                {
                    var model = new ChannelModel()
                    {
                        Id = channel.Id,
                        Name = channel.Name,
                        Code = channel.Code,
                        Type = channel.Type.ToString(),
                        Value = channel.Value,
                        LTS = channel.LTS,
                        CreatedAt = channel.CreatedAt,
                        UpdatedAt = channel.UpdatedAt,
                    };
                    ChannelModels.Add(model);
                }
            }

            return Ok(new ChannelResponseModel()
            {
                Channels = ChannelModels,
                Message = "Success",
                Status = true
            });
        }

        [HttpGet("{id}")]
        public ActionResult<ChannelResponseModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest(new ChannelResponseModel()
                {
                    Message = "Channel model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var channel = context.Channels.FirstOrDefault(d => d.Id == id);
                if (channel != null)
                {
                    return Ok(new ChannelResponseModel()
                    {
                        Channel = new ChannelModel()
                        {
                            Id = channel.Id,
                            Code = channel.Code,
                            Name = channel.Name,
                            Type = channel.Type.ToString(),
                            Value = channel.Value,
                            LTS = channel.LTS,
                            CreatedAt = channel.CreatedAt,
                            UpdatedAt = channel.UpdatedAt,
                        },
                        Message = "Success",
                        Status = true
                    });
                }
            }

            return NotFound(new ChannelResponseModel()
            {
                Message = "Channel not found",
                Status = false
            });
        }

        [HttpPost]
        public ActionResult<ChannelResponseModel> Post([FromBody] ChannelModel model)
        {
            if (model == null)
            {
                return BadRequest(new ChannelResponseModel()
                {
                    Message = "Channel model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var channel = new Channel()
                {
                    Name = model.Name,
                    Code = model.Code,
                    Type = (ChannelType)Enum.Parse(typeof(ChannelType), model.Type),
                    Value = model.Value,
                    LTS = model.LTS,
                };

                context.Channels.Add(channel);
                context.SaveChanges();

                model.Id = channel.Id;
                model.CreatedAt = channel.CreatedAt;
                model.UpdatedAt = channel.UpdatedAt;
            }

            return Ok(new ChannelResponseModel()
            {
                Channel = model,
                Message = "Channel created successfully",
                Status = true
            });
        }

        [HttpPut]
        public ActionResult<ChannelResponseModel> Put([FromBody] ChannelModel model)
        {
            if (model == null)
            {
                return BadRequest(new ChannelResponseModel() { Message = "Channel model required", Status = false });
            }

            using (var context = new SaamsContext())
            {
                var channel = context.Channels.FirstOrDefault(d => d.Id == model.Id);
                if (channel == null)
                {
                    return NotFound(new ChannelResponseModel()
                    {
                        Message = "Channel not found",
                        Status = false,
                    });
                }

                channel.Code = model.Code;
                channel.Name = model.Name;
                channel.Type = (ChannelType)Enum.Parse(typeof(ChannelType), model.Type);
                channel.Value = model.Value;
                channel.LTS = model.LTS;
                context.Channels.Update(channel);
                context.SaveChanges();

                model.CreatedAt = channel.CreatedAt;
                model.UpdatedAt = channel.UpdatedAt;
            }

            return Ok(new ChannelResponseModel()
            {
                Channel = model,
                Message = "Channel updated successfully",
                Status = true
            });
        }

        [HttpDelete("{id}")]
        public ActionResult<ChannelResponseModel> Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest(new ChannelResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false,
                });
            }

            using (var context = new SaamsContext())
            {
                var channel = context.Channels.FirstOrDefault(x => x.Id == id);
                if (channel == null)
                {
                    return NotFound(new ChannelResponseModel()
                    {
                        Message = "Channel not found",
                        Status = false,
                    });
                }

                context.Channels.Remove(channel);
                context.SaveChanges();
            }
            return Ok(new ChannelResponseModel()
            {
                Message = "Channel successfully deleted",
                Status = true,
            });
        }
    }
}
