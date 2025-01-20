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
        public ActionResult<DepartmentResponseModel> Get()
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
                        CreatedAt = department.CreatedAt,
                        UpdatedAt = department.UpdatedAt,
                    };
                    departmentModels.Add(model);
                }
            }

            return Ok(new DepartmentResponseModel()
            {
                Departments = departmentModels,
                Message = "Success",
                Status = true
            });
        }

        [HttpGet("{id}")]
        public ActionResult<DepartmentResponseModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest(new DepartmentResponseModel()
                {
                    Message = "Department model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var department = context.Departments.FirstOrDefault(d => d.Id == id);
                if (department != null)
                {
                    return Ok(new DepartmentResponseModel()
                    { 
                        Department = new DepartmentModel()
                        {
                            Id = department.Id,
                            Code = department.Code,
                            Name = department.Name,
                            CreatedAt = department.CreatedAt,
                            UpdatedAt = department.UpdatedAt,
                        },
                        Message = "Success",
                        Status = true
                    });
                }
            }

            return NotFound(new DepartmentResponseModel()
            {
                Message = "Department not found",
                Status = false
            });
        }

        [HttpPost]
        public ActionResult<DepartmentResponseModel> Post([FromBody] DepartmentModel model)
        {
            if (model == null)
            {
                return BadRequest(new DepartmentResponseModel() 
                { 
                    Message = "Department model required", 
                    Status = false 
                });
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
                model.CreatedAt = department.CreatedAt;
                model.UpdatedAt = department.UpdatedAt;
            }

            return Ok(new DepartmentResponseModel()
            {
                Department = model,
                Message = "Department created successfully",
                Status = true
            });
        }

        [HttpPut]
        public ActionResult<DepartmentResponseModel> Put([FromBody] DepartmentModel model)
        {
            if (model == null)
            {
                return BadRequest(new DepartmentResponseModel() { Message = "Department model required", Status = false });
            }

            using (var context = new SaamsContext())
            {
                var department = context.Departments.FirstOrDefault(d => d.Id == model.Id);
                if (department == null)
                {
                    return NotFound(new DepartmentResponseModel()
                    {
                        Message = "Department not found",
                        Status = false,
                    });
                }

                department.Code = model.Code;
                department.Name = model.Name;
                context.Departments.Update(department);
                context.SaveChanges();

                model.CreatedAt = department.CreatedAt;
                model.UpdatedAt = department.UpdatedAt;
            }

            return Ok(new DepartmentResponseModel()
            {
                Department = model,
                Message = "Department updated successfully",
                Status = true
            });
        }

        [HttpDelete("{id}")]
        public ActionResult<DepartmentResponseModel> Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest(new DepartmentResponseModel()
                { 
                    Message = "Invalid ID",
                    Status = false,
                });
            }

            using (var context = new SaamsContext())
            {
                var department = context.Departments.FirstOrDefault(x => x.Id == id);
                if (department == null)
                {
                    return NotFound(new DepartmentResponseModel()
                    {
                        Message = "Department not found",
                        Status = false,
                    });
                }

                context.Departments.Remove(department);
                context.SaveChanges();
            }
            return Ok(new DepartmentResponseModel()
            {
                Message = "Department successfully deleted",
                Status = true,
            });
        }
    }
}
