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
        public ActionResult<UserResponseModel> Get()
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
                        UserNumber = user.UserNumber,
                        UserName = user.UserName,
                        Password = user.Password,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Phone = user.Phone,
                        Sex = user.Sex.ToString(),
                        DateOfBirth = user.DateOfBirth,
                        DateOfJoining = user.DateOfJoining,
                        ReportsTo = user.ReportsTo,
                        RoleId = user.RoleId,
                        CompanyId = user.CompanyId,
                        DesignationId = user.DesignationId,
                        DepartmentId = user.DepartmentId,
                        ShiftId = user.ShiftId,
                    };
                    userModels.Add(model);
                }
            }

            return Ok(new UserResponseModel()
            {
                Users = userModels,
                Message = "Success",
                Status = true,
            });
        }

        [HttpGet("{id}")]
        public ActionResult<UserResponseModel> Get(int id)
        {
            if (id == 0)
            {
                return BadRequest(new UserResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false,
                });
            }

            using (var context = new SaamsContext())
            {
                var user = context.Users.FirstOrDefault(d => d.Id == id);
                if (user != null)
                {
                    return Ok(new UserResponseModel()
                    { 
                        User = new UserModel()
                        {
                            Id = user.Id,
                            UserNumber = user.UserNumber,
                            UserName = user.UserName,
                            Password = user.Password,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Email = user.Email,
                            Phone = user.Phone,
                            Sex = user.Sex.ToString(),
                            DateOfBirth = user.DateOfBirth,
                            DateOfJoining = user.DateOfJoining,
                            ReportsTo = user.ReportsTo,
                            RoleId = user.RoleId,
                            CompanyId = user.CompanyId,
                            DesignationId = user.DesignationId,
                            DepartmentId = user.DepartmentId,
                            ShiftId = user.ShiftId,
                        },
                        Message = "Success",
                        Status = true,
                    });
                }
            }

            return NotFound(new UserResponseModel()
            { 
                Message = "User not found",
                Status = false
            });
        }

        [HttpPost]
        public ActionResult<UserResponseModel> Post([FromBody] UserModel model)
        {
            if (model == null)
            {
                return BadRequest(new UserResponseModel()
                {
                    Message = "User model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var user = new User()
                {
                    Id = model.Id,
                    UserNumber = model.UserNumber,
                    UserName = model.UserName,
                    Password = AESEncryption.Encrypt(model.Password),
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Email = model.Email,
                    Phone = model.Phone,
                    Sex = (Sex)Enum.Parse(typeof(Sex), model.Sex),
                    DateOfBirth = model.DateOfBirth,
                    DateOfJoining = model.DateOfJoining,
                    ReportsTo = model.ReportsTo,
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

            return Ok(new UserResponseModel()
            { 
                User = model,
                Message = "Created successfully",
                Status = true
            });
        }

        [HttpPut]
        public ActionResult<UserResponseModel> Put([FromBody] UserModel model)
        {
            if (model == null)
            {
                return BadRequest(new UserResponseModel()
                {
                    Message = "User model required",
                    Status = false
                });
            }

            using (var context = new SaamsContext())
            {
                var user = context.Users.FirstOrDefault(d => d.Id == model.Id);
                if (user == null)
                {
                    return NotFound(new UserResponseModel()
                    { 
                        Message = "User not found",
                        Status = false
                    });
                }

                user.UserNumber = model.UserNumber;
                user.UserName = model.UserName;
                user.Password = AESEncryption.Encrypt(model.Password);
                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.Email = model.Email;
                user.Phone = model.Phone;
                user.Sex = (Sex)Enum.Parse(typeof(Sex), model.Sex);
                user.DateOfBirth = model.DateOfBirth;
                user.DateOfJoining = model.DateOfJoining;
                user.ReportsTo = model.ReportsTo;
                user.RoleId = model.RoleId;
                user.CompanyId = model.CompanyId;
                user.DesignationId = model.DesignationId;
                user.DepartmentId = model.DepartmentId;
                user.ShiftId = model.ShiftId;
                context.Users.Update(user);
                context.SaveChanges();
            }

            return Ok(new UserResponseModel()
            {
                User = model,
                Message = "User updated successfully",
                Status = true
            });
        }

        [HttpDelete("{id}")]
        public ActionResult<UserResponseModel> Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest(new UserResponseModel()
                {
                    Message = "Invalid ID",
                    Status = false,
                });
            }

            using (var context = new SaamsContext())
            {
                var user = context.Users.FirstOrDefault(x => x.Id == id);
                if (user == null)
                {
                    return NotFound(new UserResponseModel()
                    {
                        Message = "User not found",
                        Status = false,
                    });
                }

                context.Users.Remove(user);
                context.SaveChanges();
            }
            return Ok(new UserResponseModel()
            {
                Message = "User deleted successfully",
                Status = true,
            });
        }
    }
}
