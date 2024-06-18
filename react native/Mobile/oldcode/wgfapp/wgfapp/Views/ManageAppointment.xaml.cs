using wgfapp.Common.Models;
using wgfapp.Models;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ManageAppointment : ContentPage
    {
        private readonly ManageAppointmentViewModel _manageAppointmentViewModel;

        public ManageAppointment(ManageAppointmentViewModel manageAppointmentViewModel, Appointment appointment = null)
        {
            _manageAppointmentViewModel = manageAppointmentViewModel;
            _manageAppointmentViewModel.IsEditing = appointment != null;

            _manageAppointmentViewModel.SetAppointmentInfo(appointment);

            InitializeComponent();
            this.BindingContext = _manageAppointmentViewModel;
            _manageAppointmentViewModel.Title = _manageAppointmentViewModel.IsEditing ? "Manage Appointment" : "New Appointment";
        }

        void OnLabelTapGestureRecognizerTapped(System.Object sender, System.EventArgs e)
        {
            pickerLabel.Focus();
        }

        void OnStatusTapGestureRecognizerTapped(System.Object sender, System.EventArgs e)
        {
            pickerStatus.Focus();
        }
    }
}