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
        public ActionResult<IEnumerable<DesignationModel>> Get()
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

            return Ok(designationModels);
        }

        [HttpGet("{id}")]
        public ActionResult<DesignationModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var designation = context.Designations.First(d => d.Id == id);
                if (designation != null)
                {
                    return Ok(
                        new DesignationModel()
                        {
                            Id = designation.Id,
                            Code = designation.Code,
                            Name = designation.Name,
                        });
                }
            }

            return NotFound();
        }

        [HttpPost]
        public ActionResult<DesignationModel> Post([FromBody] DesignationModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                Designation designation = new Designation()
                {
                    Name = model.Name,
                    Code = model.Code,
                };

                _logger.LogDebug($"Adding designation Name={designation.Name}, Code={designation.Code}, CreatedAt={designation.CreatedAt}, UpdateAt={designation.UpdatedAt}");

                context.Designations.Add(designation);
                context.SaveChanges();

                model.Id = designation.Id;
            }

            return Ok(model);
        }

        [HttpPut]
        public ActionResult Put([FromBody] DesignationModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var designation = context.Designations.First(d => d.Id == model.Id);
                if (designation == null)
                {
                    return NotFound();
                }

                designation.Code = model.Code;
                designation.Name = model.Name;
                context.Designations.Update(designation);
                context.SaveChanges();
            }

            return Ok();
        }
    }
}
