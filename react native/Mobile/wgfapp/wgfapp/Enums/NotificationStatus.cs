using System;
using System.ComponentModel;

namespace wgfapp.Enums
{
    public enum NotificationStatus
    {
        [Description("Block Notifications")]
        Block = 0,

        [Description("Receive Notifications")]
        Receive = 1
    }
}
