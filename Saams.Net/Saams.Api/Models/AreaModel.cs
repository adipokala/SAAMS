namespace Saams.Api.Models
{
    public class AreaModel : BaseModel
    {
        public required string Name { get; set; }

        public required string Code { get; set; }
    }

    public class AreaResponseModel : ResponseModel
    {
        public AreaModel? Area { get; set; }

        public List<AreaModel>? Areas { get; set; }
    }
}
