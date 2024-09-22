namespace Saams.Api.Models
{
    public class CompanyModel
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public required string Code { get; set; }

        public required string Address { get; set; }

        public required string City { get; set; }

        public required string State { get; set; }

        public required string Pincode { get; set; }

        public required string Email { get; set; }

        public required string Phone { get; set; }

        public string? Fax { get; set; }
    }
}
