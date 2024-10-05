namespace Saams.Api.Models
{
    public class RolePrivilegeModel : BaseModel
    {
        public int RoleId { get; set; }

        public int PrivilegeId { get; set; }
    }

    public class RolePrivilegeResponseModel : ResponseModel
    {
        public RolePrivilegeModel? RolePrivilege { get; set; }

        public List<RolePrivilegeModel>? RolePrivileges { get; set; }
    }
}
