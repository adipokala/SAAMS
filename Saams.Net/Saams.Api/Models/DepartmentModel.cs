namespace Saams.Api.Models
{
    public class DepartmentModel : BaseModel
    {
        public required string Name { get; set; }

        public required string Code { get; set; }
    }

    public class DepartmentResponseModel : ResponseModel
    {
        public DepartmentModel? Department { get; set; }

        public List<DepartmentModel>? Departments { get; set; }
    }
}
