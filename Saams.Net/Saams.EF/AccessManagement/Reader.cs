using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Saams.EF.AccessManagement
{
    [Table("Readers")]
    public class Reader : IEntity
    {
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Code { get; set; }

        [Required]
        public required string SerialNumber { get; set; }

        [Required]
        public required DateOnly InstallationDate { get; set; }

        [Required]
        public required bool IsAttendanceReader { get; set; }

        [Required]
        public required bool Status {  get; set; }

        [Required]
        public required string AdminPIN { get; set; }

        [Required]
        public required bool DateValidation { get; set; }

        [Required]
        public required bool AntiPassback { get; set; }

        [Required]
        public required bool Biometrics { get; set; }

        [Required]
        public required bool SIDControl { get; set; }

        [Required]
        public required DoorMode DoorMode { get; set; }

        [Required]
        public required ReaderType Type { get; set; }

        [Required]
        public required AccessControl AccessControl { get; set; }

        [Required]
        public required ReaderSwitch Switch { get; set; }

        [Required]
        public required ReaderDisplay Display { get; set; }

        [Required]
        public required TimeSpan UnlockDuration { get; set; }

        [Required]
        public required TimeSpan DoorOpenDuration { get; set; }

        [Required]
        public required TimeSpan DisplayDuration { get; set; }

        [Required]
        public required TransactionLog TransactionLog { get; set; }

        [Required]
        public required int ChannelId { get; set; }
        public Channel Channel { get; set; } = null!;

        [Required]
        public required int AreaId { get; set; }
        public Area Area { get; set; } = null!;
    }

    public enum DoorMode
    {
        SINGLE,
        FREE,
        LOCKED
    }

    public enum ReaderType
    {
        IN,
        OUT
    }

    public enum AccessControl
    {
        DOOR,
        TURNSTILE
    }

    public enum ReaderSwitch
    {
        NONE,
        BYPASS,
        EMERGENCY
    }

    public enum ReaderDisplay
    {
        NAME,
        CARDNO
    }

    public enum TransactionLog
    {
        BLOCK_AND_WARNING,
        CIRCULAR
    }
}
