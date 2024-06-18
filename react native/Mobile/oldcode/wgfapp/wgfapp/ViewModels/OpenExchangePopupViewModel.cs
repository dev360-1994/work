using System.Windows.Input;
using wgfapp.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class OpenExchangePopupViewModel : BasePopupViewModel
    {
        public ICommand SendFilmCommand { get; private set; }
        public OpenExchangePopupViewModel(INavigationService navigationService) : base(navigationService)
        {
            SendFilmCommand = new Command(SendFilm);
        }

        private async void SendFilm()
        {
            App.Current.MainPage.DisplayAlert("Send Film clicked", "", "OK");
        }
    }
}
