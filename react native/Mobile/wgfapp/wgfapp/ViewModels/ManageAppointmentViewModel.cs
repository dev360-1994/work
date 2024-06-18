using System;
using System.Collections.Generic;
using System.Windows.Input;
using wgfapp.Common.Models;
using wgfapp.Enums;
using wgfapp.Extention;
using wgfapp.Interfaces;
using wgfapp.Models;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class ManageAppointmentViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly ISchedulerService _schedulerService;
        private readonly IPersistanceService _persistanceService;

        private string _name;
        private string _label = "Personal";
        private string _status = "Tentative";

        private DateTime _startDate = DateTime.Now;
        private TimeSpan _startTime = DateTime.Now.TimeOfDay;
        private DateTime _endDate = DateTime.Now;
        private TimeSpan _endTime = DateTime.Now.TimeOfDay;

        private bool _isAllDay = false;
        private bool _isEditing = false;

        private Appointment _selectedAppointment;
        private List<AppointmentTypeModel> _labelList;
        private List<AppointmentTypeModel> _statuslList;
        private AppointmentTypeModel _selectedStatus;
        private AppointmentTypeModel _selectedLabel;
        private Color _selectedLabelColor;
        private Color _selectedStatusColor;


        public ICommand SaveCommand { get; private set; }
        public ICommand DeleteCommand { get; private set; }
        public ICommand HelpCommand { get; private set; }
        public ICommand RepeatCommand { get; private set; }
        public ICommand LabelCommand { get; private set; }
        public ICommand StatusCommand { get; private set; }

        public string Name
        {
            get { return _name; }
            set { SetProperty(ref _name, value); }
        }

        public string Label
        {
            get { return _label; }
            set { SetProperty(ref _label, value); }
        }

        public string Status
        {
            get { return _status; }
            set { SetProperty(ref _status, value); }
        }

        public DateTime StartDate
        {
            get { return _startDate; }
            set { SetProperty(ref _startDate, value); }
        }

        public TimeSpan StartTime
        {
            get { return _startTime; }
            set { SetProperty(ref _startTime, value); }
        }

        public TimeSpan EndTime
        {
            get { return _endTime; }
            set { SetProperty(ref _endTime, value); }
        }

        public DateTime EndDate
        {
            get { return _endDate; }
            set { SetProperty(ref _endDate, value); }
        }

        public bool IsAllDay
        {
            get { return _isAllDay; }
            set { SetProperty(ref _isAllDay, value); }
        }

        public bool IsEditing
        {
            get { return _isEditing; }
            set { SetProperty(ref _isEditing, value); }
        }

        public List<AppointmentTypeModel> LabelList
        {
            get { return _labelList; }
            set { SetProperty(ref _labelList, value); }
        }

        public List<AppointmentTypeModel> StatuslList
        {
            get { return _statuslList; }
            set { SetProperty(ref _statuslList, value); }
        }

        public AppointmentTypeModel SelectedStatus
        {
            get { return _selectedStatus; }
            set
            {
                SetProperty(ref _selectedStatus, value);
                if (value != null)
                {
                    SelectedStatusColor = SelectedStatus.FrameColor;
                    Status = _selectedStatus.LabelText;
                }
            }
        }

        public AppointmentTypeModel SelectedLabel
        {
            get { return _selectedLabel; }
            set
            {
                SetProperty(ref _selectedLabel, value);
                if (value != null)
                {
                    SelectedLabelColor = SelectedLabel.FrameColor;
                    Label = SelectedLabel.LabelText;
                }
            }
        }

        public Color SelectedLabelColor
        {
            get { return _selectedLabelColor; }
            set { SetProperty(ref _selectedLabelColor, value); }
        }

        public Color SelectedStatusColor
        {
            get { return _selectedStatusColor; }
            set { SetProperty(ref _selectedStatusColor, value); }
        }


        public ManageAppointmentViewModel(INavigationService navigationService, ISchedulerService schedulerService, IPersistanceService persistanceService)
        {
            _navigationService = navigationService;
            _schedulerService = schedulerService;
            _persistanceService = persistanceService;

            StatuslList = new List<AppointmentTypeModel>()
            {
                new AppointmentTypeModel{LabelText = StatusType.Free.GetDescription(), FrameColor =  Color.Green },

                new AppointmentTypeModel{LabelText = StatusType.Tentative.GetDescription(), FrameColor =  Color.FromHex("#949494") },

                new AppointmentTypeModel{LabelText = StatusType.Busy.GetDescription(), FrameColor =  Color.FromHex("#3D89F6") },

                new AppointmentTypeModel{LabelText = StatusType.OutOfOffice.GetDescription(), FrameColor =  Color.FromHex("#CA3184") },

                new AppointmentTypeModel{LabelText = StatusType.WorkingElsewhere.GetDescription(), FrameColor =  Color.FromHex("#F8FD54") },
            };

            LabelList = new List<AppointmentTypeModel>()
            {
                new AppointmentTypeModel{LabelText = LabelType.None.GetDescription(), FrameColor =  Color.FromHex("#949494") },

                new AppointmentTypeModel{LabelText = LabelType.Important.GetDescription(), FrameColor =  Color.FromHex("#E15F5D") },

                new AppointmentTypeModel{LabelText = LabelType.Business.GetDescription(), FrameColor =  Color.FromHex("#F08336") },

                new AppointmentTypeModel{LabelText = LabelType.Persional.GetDescription(), FrameColor =  Color.FromHex("#F6BF4A") },

                new AppointmentTypeModel{LabelText = LabelType.Vacation.GetDescription(), FrameColor =  Color.FromHex("#EE768C") },

                new AppointmentTypeModel{LabelText = LabelType.MustAttend.GetDescription(), FrameColor =  Color.FromHex("#9169AE") },

                new AppointmentTypeModel{LabelText = LabelType.TravelRequired.GetDescription(), FrameColor =  Color.FromHex("#706FF6") },

                new AppointmentTypeModel{LabelText = LabelType.NeedsPreparation.GetDescription(), FrameColor =  Color.FromHex("#1956D2") },

                new AppointmentTypeModel{LabelText = LabelType.Birthday.GetDescription(), FrameColor =  Color.FromHex("#4BAFEA") },

                new AppointmentTypeModel{LabelText = LabelType.Anniversary.GetDescription(), FrameColor =  Color.FromHex("#4195AC") },

                new AppointmentTypeModel{LabelText = LabelType.PhoneCall.GetDescription(), FrameColor =  Color.FromHex("#5BC44B") }
            };

            SaveCommand = new Command(Save);
            DeleteCommand = new Command(Delete);
            HelpCommand = new Command(Help);
            RepeatCommand = new Command(RepeatClicked);
            LabelCommand = new Command(LabelClicked);
            StatusCommand = new Command(StatusClicked);
        }

        public void SetAppointmentInfo(Appointment appointment)
        {
            if (appointment == null)
            {
                SelectedLabel = LabelList[0];
                SelectedStatus = StatuslList[0];
                return;
            }

            _selectedAppointment = appointment;

            Name = appointment.Subject.ToString();
            StartDate = appointment.StartDate;
            StartTime = appointment.StartDate.TimeOfDay;
            EndDate = appointment.EndDate;
            EndTime = appointment.EndDate.TimeOfDay;
            IsAllDay = appointment.AllDay;

            SelectedLabel = LabelList[appointment.Label];
            SelectedLabelColor = SelectedLabel.FrameColor;
            Label = SelectedLabel.LabelText;

            SelectedStatus = StatuslList[appointment.Status];
            SelectedStatusColor = SelectedStatus.FrameColor;
            Status = _selectedStatus.LabelText;
        }

        private async void Save()
        {
            if (string.IsNullOrEmpty(Name))
            {
                if (string.IsNullOrEmpty(Name))
                    await App.Current.MainPage.DisplayAlert("Appointment", "Please enter subject name", "OK");

                return;
            }

            Appointment appointment = new Appointment()
            {
                Subject = Name,
                TeamId = _persistanceService.UserInfo.TeamId,
                UserId = _persistanceService.UserInfo.UserId,
                Text = Name,
                Status = StatuslList.IndexOf(SelectedStatus),
                Label = LabelList.IndexOf(SelectedLabel),
                AllDay = IsAllDay,
                StartDate = IsAllDay ? StartDate : StartDate.Date + StartTime,
                EndDate = IsAllDay ? EndDate : EndDate.Date + EndTime,
            };
           

            if (_selectedAppointment != null)
            {
                appointment.TeamId = _selectedAppointment.TeamId;
                appointment.UserId = _selectedAppointment.UserId;
                appointment.UniqueId = _selectedAppointment.UniqueId;
                appointment.Type = _selectedAppointment.Type;
              
                appointment.AllDay = IsAllDay;
                if (_selectedAppointment.Location == null)
                    appointment.Location = "Some location";
                else
                    appointment.Location = _selectedAppointment.Location;

                if (_selectedAppointment.Description == null)
                    appointment.Description = "Some Description String";
                else
                    appointment.Description = _selectedAppointment.Description;

             
                appointment.ResourceId = _selectedAppointment.ResourceId;
                appointment.ResourceIds = _selectedAppointment.ResourceIds;
                appointment.Text = _selectedAppointment.Text;

                if (_selectedAppointment.ReminderInfo == null)
                    appointment.ReminderInfo = "Some ReminderInfo String";
                else
                    appointment.ReminderInfo = _selectedAppointment.ReminderInfo;

                if (_selectedAppointment.RecurrenceInfo == null)
                    appointment.RecurrenceInfo = "Some RecurrenceInfo String";
                else
                    appointment.RecurrenceInfo = _selectedAppointment.RecurrenceInfo;

                if (_selectedAppointment.CustomField1 == null)
                    appointment.CustomField1 = "Some CustomField1 String";
                else
                    appointment.CustomField1 = _selectedAppointment.CustomField1;

                

                Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Updating appointment...");

                var updateAppointmentResponse = await _schedulerService.UpdateAppointment(appointment, _persistanceService.Token);
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
                if (updateAppointmentResponse.Status != System.Net.HttpStatusCode.OK)
                {
                    await App.Current.MainPage.DisplayAlert("Appointment", updateAppointmentResponse.Message, "OK");
                    return;
                }

                await App.Current.MainPage.DisplayAlert("Appointment", updateAppointmentResponse.Message, "OK");
                await _navigationService.GoBackAsync();
            }
            else
            {
                Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Adding appointment...");
                appointment.Type = 0;
                appointment.Location = "Some location";
                appointment.Description = "Some Description String";
                appointment.ResourceId = 2;
                appointment.ResourceIds = 0;
                appointment.RecurrenceInfo = "Some RecurrenceInfo String";
                appointment.ReminderInfo = "Some ReminderInfo String";
                appointment.CustomField1 = "Some CustomField1 String";

                var addAppointmentResponse = await _schedulerService.AddAppointment(appointment, _persistanceService.Token);
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
                if (addAppointmentResponse.Status != System.Net.HttpStatusCode.OK)
                {
                    await App.Current.MainPage.DisplayAlert("Appointment", addAppointmentResponse.Message, "OK");
                    return;
                }

                await App.Current.MainPage.DisplayAlert("Appointment", addAppointmentResponse.Message, "OK");
                await _navigationService.GoBackAsync();
            }
        }

        private async void Delete()
        {
            if (_selectedAppointment == null)
                return;

            bool shouldDelete = await Acr.UserDialogs.UserDialogs.Instance.ConfirmAsync("Are you sure you want to delete Appointment?", "Delete Appointment", "Ok", "Cancel");

            if (!shouldDelete)
                return;

            Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Deleting appointment...");

            var deleteAppointmentResponse = await _schedulerService.DeleteAppointment(_selectedAppointment, _persistanceService.Token);
            Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            if (deleteAppointmentResponse.Status != System.Net.HttpStatusCode.OK)
            {
                await App.Current.MainPage.DisplayAlert("Appointment", deleteAppointmentResponse.Message, "OK");
                return;
            }

            await App.Current.MainPage.DisplayAlert("Appointment", deleteAppointmentResponse.Message, "OK");
            await _navigationService.GoBackAsync();
        }

        private void Help()
        {
            System.Diagnostics.Debug.WriteLine("Help Button clicked...");
        }

        private void RepeatClicked()
        {
            System.Diagnostics.Debug.WriteLine("Repeat Button clicked...");
        }

        private void LabelClicked()
        {
            System.Diagnostics.Debug.WriteLine("Label Button clicked...");
        }

        private void StatusClicked()
        {
            System.Diagnostics.Debug.WriteLine("Status Button clicked...");
        }
    }
}
