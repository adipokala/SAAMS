using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.EF.AccessManagement;
using Saams.EF;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AreaController : ControllerBase
    {
        private readonly ILogger<AreaController> _logger;

        public AreaController(ILogger<AreaController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<AreaResponseModel> Get()
        {
            List<AreaModel> AreaModels = new List<AreaModel>();
            
            using (var context = new SaamsContext())
            {
                var areas = context.Areas;
                foreach (var area in areas)
                {
                    var model = new AreaModel()
                    {
                        Id = area.Id,
                        Name = area.Name,
                        Code = area.Code,
                        CreatedAt = area.CreatedAt,
                        UpdatedAt = area.UpdatedAt,
                    };
                    AreaModels.Add(model);
                }
            }

            return Ok(new AreaResponseModel()
            {
                Areas = AreaModels,
                Message = "Success",
                Status = true
            });
        }

        [HttpGet("{id}")]
        public ActionResult<AreaResponseModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest(new AreaResponseModel()
                {
                    Message = "Area model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var area = context.Areas.FirstOrDefault(d => d.Id == id);
                if (area != null)
                {
                    return Ok(new AreaResponseModel()
                    {
                        Area = new AreaModel()
                        {
                            Id = area.Id,
                            Code = area.Code,
                            Name = area.Name,
                            CreatedAt = area.CreatedAt,
                            UpdatedAt = area.UpdatedAt,
                        },
                        Message = "Success",
                        Status = true
                    });
                }
            }

            return NotFound(new AreaResponseModel()
            {
                Message = "Area not found",
                Status = false
            });
        }

        [HttpPost]
        public ActionResult<AreaResponseModel> Post([FromBody] AreaModel model)
        {
            if (model == null)
            {
                return BadRequest(new AreaResponseModel()
                {
                    Message = "Area model required",
                    Status = false
                });
            }

            try
            {
                using (var context = new SaamsContext())
                {
                    var area = new Area()
                    {
                        Name = model.Name,
                        Code = model.Code,
                    };

                    context.Areas.Add(area);
                    context.SaveChanges();

                    model.Id = area.Id;
                    model.CreatedAt = area.CreatedAt;
                    model.UpdatedAt = area.UpdatedAt;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new AreaResponseModel()
                    {
                        Message = ex.Message,
                        Status = false
                    });
            }

            return Ok(new AreaResponseModel()
            {
                Area = model,
                Message = "Area created successfully",
                Status = true
            });
        }

        [HttpPut]
        public ActionResult<AreaResponseModel> Put([FromBody] AreaModel model)
        {
            if (model == null)
            {
                return BadRequest(new AreaResponseModel() { Message = "Area model required", Status = false });
            }

            try
            {
                using (var context = new SaamsContext())
                {
                    var area = context.Areas.FirstOrDefault(d => d.Id == model.Id);
                    if (area == null)
                    {
                        return NotFound(new AreaResponseModel()
                        {
                            Message = "Area not found",
                            Status = false,
                        });
                    }

                    area.Code = model.Code;
                    area.Name = model.Name;
                    context.Areas.Update(area);
                    context.SaveChanges();

                    model.CreatedAt = area.CreatedAt;
                    model.UpdatedAt = area.UpdatedAt;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new AreaResponseModel()
                    {
                        Message = ex.Message,
                        Status = false
                    });
            }

            return Ok(new AreaResponseModel()
            {
                Area = model,
                Message = "Area updated successfully",
                Status = true
            });
        }

        [HttpDelete("{id}")]
        public ActionResult<AreaResponseModel> Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest(new AreaResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false,
                });
            }

            using (var context = new SaamsContext())
            {
                var area = context.Areas.FirstOrDefault(x => x.Id == id);
                if (area == null)
                {
                    return NotFound(new AreaResponseModel()
                    {
                        Message = "Area not found",
                        Status = false,
                    });
                }

                context.Areas.Remove(area);
                context.SaveChanges();
            }
            return Ok(new AreaResponseModel()
            {
                Message = "Area successfully deleted",
                Status = true,
            });
        }
    }
}
