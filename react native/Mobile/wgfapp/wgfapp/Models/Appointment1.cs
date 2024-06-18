using System;
namespace wgfapp.Models
{
    public class Appointment1
    {
        public int Id { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public string Subject { get; set; }

        public int LabelId { get; set; }

        public int StatusId { get; set; }

        public string Location { get; set; }

        public bool IsAllDayEvent { get; set; }

        public string RecurrenceInfo { get; set; }

    }
}
