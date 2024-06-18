using System;
using Xamarin.Forms;

namespace wgfapp.Models
{
    public class PracticePlan : BaseModel
    {
        private HtmlWebViewSource _html;
        private DateTime _planDate;

        public HtmlWebViewSource Html
        {
            get { return _html; }
            set { SetProperty(ref _html, value); }
        }

        public DateTime PlanDate
        {
            get { return _planDate; }
            set { SetProperty(ref _planDate, value); }
        }
    }
}
