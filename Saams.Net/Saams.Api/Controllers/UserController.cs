using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saams.Api.Models;
using Saams.EF.UserManagement;
using Saams.EF;
using System.ComponentModel.Design;
using System.Numerics;
using Saams.Api.Utils;

namespace Saams.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<UserModel>> Get()
        {
            List<UserModel> userModels = new List<UserModel>();

            using (var context = new SaamsContext())
            {
                var users = context.Users;
                foreach (var user in users)
                {
                    var model = new UserModel()
                    {
                        Id = user.Id,
                        UserName = user.UserName,
                        Password = user.Password,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Phone = user.Phone,
                        Sex = user.Sex.ToString(),
                        DateOfBirth = user.DateOfBirth,
                        DateOfJoining = user.DateOfJoining,
                        RoleId = user.RoleId,
                        CompanyId = user.CompanyId,
                        DesignationId = user.DesignationId,
                        DepartmentId = user.DepartmentId,
                        ShiftId = user.ShiftId,
                    };
                    userModels.Add(model);
                }
            }

            return Ok(userModels);
        }

        [HttpGet("{id}")]
        public ActionResult<UserModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var user = context.Users.First(d => d.Id == id);
                if (user != null)
                {
                    return Ok(
                        new UserModel()
                        {
                            Id = user.Id,
                            UserName = user.UserName,
                            Password = user.Password,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Email = user.Email,
                            Phone = user.Phone,
                            Sex = user.Sex.ToString(),
                            DateOfBirth = user.DateOfBirth,
                            DateOfJoining = user.DateOfJoining,
                            RoleId = user.RoleId,
                            CompanyId = user.CompanyId,
                            DesignationId = user.DesignationId,
                            DepartmentId = user.DepartmentId,
                            ShiftId = user.ShiftId,
                        });
                }
            }

            return NotFound();
        }

        [HttpPost]
        public ActionResult<UserModel> Post([FromBody] UserModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var user = new User()
                {
                    Id = model.Id,
                    UserName = model.UserName,
                    Password = AESEncryption.Encrypt(model.Password),
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Email = model.Email,
                    Phone = model.Phone,
                    Sex = (Sex)Enum.Parse(typeof(Sex), model.Sex),
                    DateOfBirth = model.DateOfBirth,
                    DateOfJoining = model.DateOfJoining,
                    RoleId = model.RoleId,
                    CompanyId = model.CompanyId,
                    DesignationId = model.DesignationId,
                    DepartmentId = model.DepartmentId,
                    ShiftId = model.ShiftId,
                };

                context.Users.Add(user);
                context.SaveChanges();

                model.Id = user.Id;
            }

            return Ok(model);
        }

        [HttpPut]
        public ActionResult Put([FromBody] UserModel model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            using (var context = new SaamsContext())
            {
                var user = context.Users.First(d => d.Id == model.Id);
                if (user == null)
                {
                    return NotFound();
                }

                user.UserName = model.UserName;
                user.Password = AESEncryption.Encrypt(model.Password);
                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.Email = model.Email;
                user.Phone = model.Phone;
                user.Sex = (Sex)Enum.Parse(typeof(Sex), model.Sex);
                user.DateOfBirth = model.DateOfBirth;
                user.DateOfJoining = model.DateOfJoining;
                user.RoleId = model.RoleId;
                user.CompanyId = model.CompanyId;
                user.DesignationId = model.DesignationId;
                user.DepartmentId = model.DepartmentId;
                user.ShiftId = model.ShiftId;
                context.Users.Update(user);
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
                var user = context.Users.First(x => x.Id == id);
                if (user == null)
                {
                    return NotFound();
                }

                context.Users.Remove(user);
                context.SaveChanges();
            }
            return Ok();
        }
    }
}
