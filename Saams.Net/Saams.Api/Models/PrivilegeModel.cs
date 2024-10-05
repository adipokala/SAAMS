namespace Saams.Api.Models
{
    public class PrivilegeModel : BaseModel
    {
        public required string Name { get; set; }

        public required string Code { get; set; }
    }

    public class PrivilegeResponseModel : ResponseModel
    {
        public PrivilegeModel? Privilege { get; set; }

        public List<PrivilegeModel>? Privileges { get; set; }
    }
}
