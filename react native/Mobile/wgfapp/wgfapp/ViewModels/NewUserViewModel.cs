using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class NewUserViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        public ICommand HelpCommand { get; private set; }
        public ICommand SaveUserCommand { get; private set; }

        public NewUserViewModel(INavigationService navigationService)
        {
            _navigationService = navigationService;
            HelpCommand = new Command(NavigateOnHelp);
            SaveUserCommand = new Command(NavigateOnSaveUser);
        }

        private async void NavigateOnSaveUser()
        {
            var action = await App.Current.MainPage.DisplayAlert("Save User", "Are you sure?", "Yes", "No");
            if (action)
                await _navigationService.GoBackAsync();
        }


        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "NewUser");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }
    }
}
