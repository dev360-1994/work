using System;

namespace mvno_admin.Models
{
    public class MassTextViewModel
    {
        public string Clec { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public long MDN { get; set; }

        public MassTextViewModel(string clec, DateTime? startDate, DateTime? endDate, long mdn)
        {
            Clec = clec;
            StartDate = startDate;
            EndDate = endDate;
            MDN = mdn;
        }

        public MassTextViewModel()
        {
        }
    }

}