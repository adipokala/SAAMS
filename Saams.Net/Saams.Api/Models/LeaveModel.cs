using System.ComponentModel.DataAnnotations;

namespace Saams.Api.Models
{
    public class LeaveModel : BaseModel
    {
        public required string Name { get; set; }

        public required string Code { get; set; }

        public required string Description { get; set; }

        public required int Count { get; set; }

        public required bool AutoRenew { get; set; }

        public required TimeSpan Validity { get; set; }

        public DateOnly RenewalDate { get; set; }
    }

    public class LeaveResponseModel : ResponseModel
    {
        public LeaveModel? Leave { get; set; }

        public List<LeaveModel>? Leaves { get; set; }
    }
}
