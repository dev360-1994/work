using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class ManageUserViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        public ICommand HelpCommand { get; private set; }
        public ICommand InviteCommand { get; private set; }
        public ICommand DeleteCommand { get; private set; }
        public ICommand SaveUserCommand { get; private set; }

        public ManageUserViewModel(INavigationService navigationService)
        {
            _navigationService = navigationService;
            HelpCommand = new Command(NavigateOnHelp);
            InviteCommand = new Command(Invite);
            DeleteCommand = new Command(Delete);
            SaveUserCommand = new Command(SaveUser);
        }

        private void SaveUser()
        {
            App.Current.MainPage.DisplayAlert("Save User", "Save User Clicked", "OK");
        }

        private void Invite()
        {
            App.Current.MainPage.DisplayAlert("Invite User", "Invite User Clicked", "OK");
        }

        private void Delete()
        {
            App.Current.MainPage.DisplayAlert("Delete User", "Are you sure?", "Yes", "No");
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "ManageUser");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }
    }
}
