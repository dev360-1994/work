using System;
using System.Collections.Generic;
using System.Text;

namespace wgfapp.Common.Models
{
    public class Dashboard
    {
    }
    public class DashboardAlerts
    {
        public int MessagesUnread { get; set; }
        public int CalendarDay { get; set; }
        public int CalendarWeek { get; set; }
        public int ExchangeInbox { get; set; }
        public int FileUpload { get; set; }
    }
}
