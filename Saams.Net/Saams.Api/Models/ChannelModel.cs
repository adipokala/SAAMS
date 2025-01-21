namespace Saams.Api.Models
{
    public class ChannelModel : BaseModel
    {
        public required string Name { get; set; }

        public required string Code { get; set; }

        public required string Type { get; set; }

        public required string Value { get; set; }

        public required bool LTS { get; set; }
    }

    public class ChannelResponseModel : ResponseModel
    {
        public ChannelModel? Channel { get; set; }

        public List<ChannelModel>? Channels { get; set; }
    }
}
