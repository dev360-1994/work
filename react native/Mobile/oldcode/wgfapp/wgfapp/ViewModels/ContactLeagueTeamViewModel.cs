using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class ContactLeagueTeamViewModel
    {
        private readonly INavigationService _navigationService;

        public ICommand HelpCommand { get; private set; }
        public ICommand SendMessageCommand { get; private set; }

        public ContactLeagueTeamViewModel(INavigationService navigationService)
        {
            HelpCommand = new Command(NavigateOnHelp);
            SendMessageCommand = new Command(SendMessage);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "ContactLeagueTeam");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private void SendMessage()
        {
            App.Current.MainPage.DisplayAlert("Send Message", "Are you sure you want to send this message to the coaches of the selected league team?", "Yes", "No");
        }
    }
}
