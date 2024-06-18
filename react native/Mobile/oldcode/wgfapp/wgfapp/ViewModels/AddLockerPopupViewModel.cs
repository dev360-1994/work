using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class AddLockerPopupViewModel : BasePopupViewModel
    {
        public ICommand AddToLocker { get; private set; }

        public AddLockerPopupViewModel(INavigationService navigationService) : base(navigationService)
        {
            AddToLocker = new Command(GotToAddToLocker);
        }

        private void GotToAddToLocker()
        {
            App.Current.MainPage.DisplayAlert("Add To Locker clicked", "", "OK");
        }
    }
}
