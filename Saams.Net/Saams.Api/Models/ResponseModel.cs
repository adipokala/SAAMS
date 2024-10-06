namespace Saams.Api.Models
{
    public abstract class ResponseModel
    {
        public required string Message { get; set; }

        public bool Status { get; set; }
    }
}
