using System.Windows.Input;
using wgfapp.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class GetLockerPopupViewModel : BasePopupViewModel
    {
        public ICommand GetFromLockerCommand { get; private set; }

        public GetLockerPopupViewModel(INavigationService navigationService) : base(navigationService)
        {
            GetFromLockerCommand = new Command(GetFromLocker);
        }

        private void GetFromLocker()
        {
            App.Current.MainPage.DisplayAlert("Get From Locker clicked", "", "OK");
        }
    }
}
