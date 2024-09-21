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
        public ActionResult<IEnumerable<CompanyModel>> Get()
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
                    });
                }
            }
            return Ok(models);
        }

        [HttpGet("{id}")]
        public ActionResult<CompanyModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var company = context.Companies.First(x => x.Id == id);
                if (company != null)
                {
                    return Ok(new CompanyModel()
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
                    });
                }
            }

            return NotFound();
        }

        [HttpPost]
        public ActionResult Post([FromBody] CompanyModel model)
        {
            if (model == null)
            {
                return BadRequest();
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
            }

            return Ok(model);
        }

        [HttpPut]
        public ActionResult Put([FromBody] CompanyModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var company = context.Companies.First(x => x.Id == model.Id);
                if (company == null)
                {
                    return NotFound();
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
                var company = context.Companies.First(x => x.Id == id);
                if (company == null)
                {
                    return NotFound();
                }

                context.Companies.Remove(company);
                context.SaveChanges();
            }

            return Ok();
        }
    }
}
