using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.EF;
using Saams.EF.UserManagement;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private ILogger<CompanyController> _logger;

        public CompanyController(ILogger<CompanyController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<CompanyResponseModel> Get()
        {
            List<CompanyModel> models = new List<CompanyModel>();

            using (var context = new SaamsContext())
            {
                var companies = context.Companies;
                foreach (var company in companies)
                {
                    models.Add(new CompanyModel()
                    {
                        Id = company.Id,
                        Name = company.Name,
                        Code = company.Code,
                        Address = company.Address,
                        City = company.City,
                        State = company.State,
                        Pincode = company.Pincode,
                        Email = company.Email,
                        Phone = company.Phone,
                        Fax = company.Fax,
                        CreatedAt = company.CreatedAt,
                        UpdatedAt = company.UpdatedAt,
                    });
                }
            }
            return Ok(new CompanyResponseModel()
            {
                Companies = models,
                Message = "Success",
                Status = true
            });
        }

        [HttpGet("{id}")]
        public ActionResult<CompanyModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest(new CompanyResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var company = context.Companies.FirstOrDefault(x => x.Id == id);
                if (company != null)
                {
                    return Ok(new CompanyResponseModel()
                    {
                        Company = new CompanyModel()
                        {
                            Id = company.Id,
                            Name = company.Name,
                            Code = company.Code,
                            Address = company.Address,
                            City = company.City,
                            State = company.State,
                            Pincode = company.Pincode,
                            Email = company.Email,
                            Phone = company.Phone,
                            Fax = company.Fax,
                            CreatedAt = company.CreatedAt,
                            UpdatedAt = company.UpdatedAt,
                        },
                        Message = "Success",
                        Status = true
                    });
                }
            }

            return NotFound(new CompanyResponseModel()
            {
                Message = "Company not found",
                Status = false
            });
        }

        [HttpPost]
        public ActionResult Post([FromBody] CompanyModel model)
        {
            if (model == null)
            {
                return BadRequest(new CompanyResponseModel()
                {
                    Message = "Company model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var company = new Company()
                {
                    Name = model.Name,
                    Code = model.Code,
                    Address = model.Address,
                    City = model.City,
                    State = model.State,
                    Pincode = model.Pincode,
                    Email = model.Email,
                    Phone = model.Phone,
                    Fax = model.Fax,
                };

                context.Companies.Add(company);
                context.SaveChanges();

                model.Id = company.Id;
                model.CreatedAt = company.CreatedAt;
                model.UpdatedAt = company.UpdatedAt;
            }

            return Ok(new CompanyResponseModel()
            {
                Company = model,
                Message = "Company created successfully",
                Status = true
            });
        }

        [HttpPut]
        public ActionResult Put([FromBody] CompanyModel model)
        {
            if (model == null)
            {
                return BadRequest(new CompanyResponseModel()
                {
                    Message = "Company model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var company = context.Companies.FirstOrDefault(x => x.Id == model.Id);
                if (company == null)
                {
                    return NotFound(new CompanyResponseModel()
                    {
                        Message = "Company not found",
                        Status = false
                    });
                }

                company.Name = model.Name;
                company.Code = model.Code;
                company.Address = model.Address;
                company.City = model.City;
                company.State = model.State;
                company.Pincode = model.Pincode;
                company.Email = model.Email;
                company.Phone = model.Phone;
                company.Fax = model.Fax;
                context.Companies.Update(company);
                context.SaveChanges();

                model.CreatedAt = company.CreatedAt;
                model.UpdatedAt = company.UpdatedAt;
            }

            return Ok(new CompanyResponseModel()
            {
                Company = model,
                Message = "Company updated successfully",
                Status = true
            });
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest(new CompanyResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var company = context.Companies.FirstOrDefault(x => x.Id == id);
                if (company == null)
                {
                    return NotFound(new CompanyResponseModel()
                    {
                        Message = "Company not found",
                        Status = false
                    });
                }

                context.Companies.Remove(company);
                context.SaveChanges();
            }

            return Ok(new CompanyResponseModel()
            {
                Message = "Company deleted successfully",
                Status = true
            });
        }
    }
}
