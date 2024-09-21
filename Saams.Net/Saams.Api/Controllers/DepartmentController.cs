using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.EF.UserManagement;
using Saams.EF;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly ILogger<DepartmentController> _logger;

        public DepartmentController(ILogger<DepartmentController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<DepartmentModel>> Get()
        {
            List<DepartmentModel> departmentModels = new List<DepartmentModel>();

            using (var context = new SaamsContext())
            {
                var departments = context.Departments;
                foreach (var department in departments)
                {
                    var model = new DepartmentModel()
                    {
                        Id = department.Id,
                        Name = department.Name,
                        Code = department.Code,
                    };
                    departmentModels.Add(model);
                }
            }

            return Ok(departmentModels);
        }

        [HttpGet("{id}")]
        public ActionResult<DepartmentModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var department = context.Departments.First(d => d.Id == id);
                if (department != null)
                {
                    return Ok(
                        new DepartmentModel()
                        {
                            Id = department.Id,
                            Code = department.Code,
                            Name = department.Name,
                        });
                }
            }

            return NotFound();
        }

        [HttpPost]
        public ActionResult<DepartmentModel> Post([FromBody] DepartmentModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var department = new Department()
                {
                    Name = model.Name,
                    Code = model.Code,
                };

                context.Departments.Add(department);
                context.SaveChanges();

                model.Id = department.Id;
            }

            return Ok(model);
        }

        [HttpPut]
        public ActionResult Put([FromBody] DepartmentModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var department = context.Departments.First(d => d.Id == model.Id);
                if (department == null)
                {
                    return NotFound();
                }

                department.Code = model.Code;
                department.Name = model.Name;
                context.Departments.Update(department);
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
                var department = context.Departments.First(x => x.Id == id);
                if (department == null)
                {
                    return NotFound();
                }

                context.Departments.Remove(department);
                context.SaveChanges();
            }
            return Ok();
        }
    }
}
