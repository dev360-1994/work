using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class Appointment : BaseUserInfo
    {

        [JsonProperty("roleId")]
        public int RoleId { get; set; }

        [JsonProperty("uniqueId")]
        public int UniqueId { get; set; }

        [JsonProperty("type")]
        public int Type { get; set; }

        [JsonProperty("startDate")]
        public DateTime StartDate { get; set; }

        [JsonProperty("endDate")]
        public DateTime EndDate { get; set; }

        [JsonProperty("startTime")]
        public TimeSpan StartTime { get; set; }

        [JsonProperty("endTime")]
        public TimeSpan EndTime { get; set; }

        [JsonProperty("allDay")]
        public bool AllDay { get; set; }

        [JsonProperty("subject")]
        public object Subject { get; set; }

        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("location")]
        public string Location { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("status")]
        public int Status { get; set; }

        [JsonProperty("label")]
        public int Label { get; set; }

        [JsonProperty("resourceId")]
        public int ResourceId { get; set; }

        [JsonProperty("resourceIds")]
        public int ResourceIds { get; set; }

        [JsonProperty("reminderInfo")]
        public string ReminderInfo { get; set; }

        [JsonProperty("recurrenceInfo")]
        public string RecurrenceInfo { get; set; }

        [JsonProperty("customField1")]
        public string CustomField1 { get; set; }
    }
}
