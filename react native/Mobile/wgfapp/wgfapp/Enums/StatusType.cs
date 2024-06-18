using System;
using System.ComponentModel;

namespace wgfapp.Enums
{
    public enum StatusType
    {
        [Description("Free")]
        Free = 0,

        [Description("Tentative")]
        Tentative = 1,

        [Description("Busy")]
        Busy = 2,

        [Description("Out Of Office")]
        OutOfOffice = 3,

        [Description("Working Elsewhere")]
        WorkingElsewhere = 4
    }
}
