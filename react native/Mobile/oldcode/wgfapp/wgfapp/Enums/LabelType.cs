using System;
using System.ComponentModel;

namespace wgfapp.Enums
{
    public enum LabelType
    {
        [Description("None")]
        None = 0,

        [Description("Important")]
        Important = 1,

        [Description("Business")]
        Business = 2,

        [Description("Persional")]
        Persional = 3,

        [Description("Vacation")]
        Vacation = 4,

        [Description("Must Attend")]
        MustAttend = 5,

        [Description("Travel Required")]
        TravelRequired = 6,

        [Description("Needs Preparation")]
        NeedsPreparation = 7,

        [Description("Birthday")]
        Birthday = 8,

        [Description("Anniversary")]
        Anniversary = 9,

        [Description("Phone Call")]
        PhoneCall = 10,


    }
}
