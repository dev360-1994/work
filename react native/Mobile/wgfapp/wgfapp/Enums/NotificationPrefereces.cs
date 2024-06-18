using System;
using System.ComponentModel;

namespace wgfapp.Enums
{
    public enum NotificationPreferece
    {
        [Description("Email And Phone")]
        EmailAndPhone = 0,

        [Description("Emain Only")]
        EmailOnly = 1,

        [Description("Phone Only")]
        PhoneOnly = 2
    }
}
