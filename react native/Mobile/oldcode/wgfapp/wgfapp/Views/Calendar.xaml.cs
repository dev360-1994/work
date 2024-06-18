using System.Linq;
using DevExpress.XamarinForms.Scheduler;
using wgfapp.Common.Models;
using wgfapp.Models;
using wgfapp.Service.Interfaces;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Calendar : TabbedPage
    {
        private readonly CalendarViewModel _calendarViewModel;
       

        public Calendar(CalendarViewModel calendarViewModel)
        {
            InitializeComponent();
            _calendarViewModel = calendarViewModel;
            BindingContext = _calendarViewModel;
        }


        protected async override void OnAppearing()
        {
            base.OnAppearing();
            await _calendarViewModel.OnViewAppearAsync();

        }

        private void DEdayView_Tap(System.Object sender, DevExpress.XamarinForms.Scheduler.SchedulerGestureEventArgs e)
        {
            System.Diagnostics.Debug.WriteLine($"Day View Tapped : {e.AppointmentInfo}, {DEdayView.VisibleTime}, {DEdayView.DayCount}");
            ShowNewOrEditAppointmentPage(e, DEdayView.DataStorage);
        }

        private void DEweekView_Tap(System.Object sender, DevExpress.XamarinForms.Scheduler.SchedulerGestureEventArgs e)
        {
            System.Diagnostics.Debug.WriteLine($"Week View Tapped : {e.AppointmentInfo}");
            ShowNewOrEditAppointmentPage(e, DEweekView.DataStorage);
        }

        private void DEmonthView_Tap(System.Object sender, DevExpress.XamarinForms.Scheduler.SchedulerGestureEventArgs e)
        {
            System.Diagnostics.Debug.WriteLine($"Month View Tapped : {e.AppointmentInfo}");

            DEdayView.Start = e.AppointmentInfo != null && e.AppointmentInfo.Appointment != null ? e.AppointmentInfo.Appointment.Start : e.IntervalInfo.Start;
            //CurrentPage = Children[0];
            ShowNewOrEditAppointmentPage(e, DEmonthView.DataStorage);
        }

        private async void ShowNewOrEditAppointmentPage(SchedulerGestureEventArgs e, SchedulerDataStorage schedulerDataStorage)
        {
            Appointment appointment = null;
            if (e.AppointmentInfo != null)
            {


                AppointmentItem appointmentItem = e.AppointmentInfo.Appointment;

                appointment = _calendarViewModel.Appointments.Where(x => x.UniqueId == (int)e.AppointmentInfo.Appointment.Id).FirstOrDefault();

            }

            await _calendarViewModel.NavigateOnManageAppointment(appointment);
        }
    }
}