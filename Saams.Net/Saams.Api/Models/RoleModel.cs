namespace Saams.Api.Models
{
    public class RoleModel : BaseModel
    {
        public required string Name { get; set; }

        public required string Code { get; set; }

        public List<PrivilegeModel>? Privileges { get; set; }
    }

    public class RoleResponseModel : ResponseModel
    {
        public RoleModel? Role { get; set; }

        public List<RoleModel>? Roles { get; set; }
    }
}
