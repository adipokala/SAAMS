namespace Saams.Api.Models
{
    public class ShiftModel
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public required string Code { get; set; }

        public required string Type { get; set; }

        public TimeSpan EntryTime { get; set; }

        public TimeSpan GraceEntryTime { get; set; }

        public TimeSpan ExitLunch { get; set; }

        public TimeSpan EntryLunch { get; set; }

        public TimeSpan ExitTime { get; set; }

        public TimeSpan GraceExitTime { get; set; }

        public TimeSpan OverTimeAllowance { get; set; }
    }

    public class ShiftResponseModel : ResponseModel
    {
        public ShiftModel? Shift { get; set; }

        public List<ShiftModel>? Shifts { get; set; }
    }
}
