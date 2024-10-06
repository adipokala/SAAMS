namespace Saams.Api.Models
{
    public class DesignationModel : BaseModel
    {
        public required string Name { get; set; }

        public required string Code { get; set; }
    }

    public class DesignationResponseModel : ResponseModel
    {
        public DesignationModel? Designation { get; set; }

        public List<DesignationModel>? Designations { get; set; }
    }
}
