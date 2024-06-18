using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Input;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Models;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class CalendarViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly ISchedulerService _schedulerService;
        private readonly IPersistanceService _persistanceService;
        private static Random rnd = new Random();

        private ObservableCollection<Appointment> _appointments;
        public ICommand HelpCommand { get; private set; }

        public ObservableCollection<Appointment> Appointments
        {
            get { return _appointments; }
            set { SetProperty(ref _appointments, value); }
        }

        public CalendarViewModel(INavigationService navigationService, ISchedulerService schedulerService, IPersistanceService persistanceService)
        {
            _navigationService = navigationService;
            _schedulerService = schedulerService;
            _persistanceService = persistanceService;
            HelpCommand = new Command(NavigateOnHelp);
        }

        public async Task NavigateOnManageAppointment(Appointment appointment)
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("appointment", appointment);

            await _navigationService.NavigateToAsync(Enums.PageKey.ManageAppointment, parameters);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Calendar");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }


        public async Task OnViewAppearAsync()
        {
            try
            {
                Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Fetching appointments...");

                Appointment appointment = new Appointment()
                {
                    UserId = _persistanceService.UserInfo.UserId,
                    TeamId = _persistanceService.UserInfo.TeamId,
                    RoleId = 1
                };

                var appoinmentsList = await _schedulerService.GetAppointments(appointment, _persistanceService.Token);
                if (appoinmentsList != null && appoinmentsList.Count > 0)
                {
                    Appointments = new ObservableCollection<Appointment>(appoinmentsList);
                }
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            }
            catch (Exception e)
            {
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            }
        }
    }
}
