using Saams.EF.AccessManagement;
using System.ComponentModel.DataAnnotations;

namespace Saams.Api.Models
{
    public class ReaderModel : BaseModel
    {
        public required string Name { get; set; }

        public required string Code { get; set; }

        public required string SerialNumber { get; set; }

        public required DateOnly InstallationDate { get; set; }

        public required bool IsAttendanceReader { get; set; }

        public required bool Status { get; set; }

        public required string AdminPIN { get; set; }

        public required bool DateValidation { get; set; }

        public required bool AntiPassback { get; set; }

        public required bool Biometrics { get; set; }

        public required bool SIDControl { get; set; }

        public required string DoorMode { get; set; }

        public required string Type { get; set; }

        public required string AccessControl { get; set; }

        public required string Switch { get; set; }

        public required string Display { get; set; }

        public required TimeSpan UnlockDuration { get; set; }

        public required TimeSpan DoorOpenDuration { get; set; }

        public required TimeSpan DisplayDuration { get; set; }

        public required string TransactionLog { get; set; }

        public required int ChannelId { get; set; }

        public required int AreaId { get; set; }
    }

    public class ReaderResponseModel : ResponseModel
    {
        public ReaderModel? Reader { get; set; }

        public List<ReaderModel>? Readers { get; set; }
    }
}
