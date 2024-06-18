using System;
using Rg.Plugins.Popup.Services;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ContactLeagueTeam : ContentPage
    {
        private readonly ContactLeagueTeamViewModel _contactLeagueTeamViewModel;

        public ContactLeagueTeam(ContactLeagueTeamViewModel contactLeagueTeamViewModel)
        {
            InitializeComponent();
            _contactLeagueTeamViewModel = contactLeagueTeamViewModel;
            BindingContext = _contactLeagueTeamViewModel;
        }
    }
}