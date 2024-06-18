using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Models;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class UsersViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly StatisticsListData _data;
        private readonly IUserService _userService;
        private readonly IPersistanceService _persistanceService;

        public IReadOnlyList<StatisticsList> Statisticslists { get => _data.StatisticsLists; }
        public ICommand HelpCommand { get; private set; }
        public ICommand SendInviteCommand { get; private set; }
        public ICommand EditUserCommand { get; private set; }
        public ICommand NewUserCommand { get; private set; }
        public ICommand OnNewInfoCommand { get; private set; }
        public ICommand OnManageCommand { get; private set; }
        public ICommand OnInviteCommand { get; private set; }


        public UsersViewModel(INavigationService navigationService, IPersistanceService persistanceService, IUserService userService)
        {
            _data = new StatisticsListData();
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _userService = userService;
            HelpCommand = new Command(NavigateOnHelp);
            SendInviteCommand = new Command(SendInvite);
            EditUserCommand = new Command(EditUser);
            NewUserCommand = new Command(NewUser);
            OnNewInfoCommand = new Command(NavigateOnNewInfo);
            OnManageCommand = new Command(NavigateOnManage);
            OnInviteCommand = new Command(NavigateOnInvite);
        }

        public async Task OnViewAppearAsync()
        {
            try
            {
                ResendInvite resendInvite = new ResendInvite()
                {
                    teamId = _persistanceService.UserInfo.TeamId,
                    userId = _persistanceService.UserInfo.UserId,
                    emailAddress = _persistanceService.UserEmail
                };

                var inviteResponse = await _userService.ResendInvite(resendInvite, _persistanceService.Token);
                if (inviteResponse.Status == System.Net.HttpStatusCode.OK)
                {

                }

                TeamUser teamUsers = new TeamUser()
                {
                    TeamId = _persistanceService.UserInfo.TeamId,
                    UserId = _persistanceService.UserInfo.UserId,
                    DateExpired = DateTime.Now,
                    FirstName = "First Name Value",
                    LastName = "Last Name Value",
                    EmailAddress = "email1@gmail.com",
                    SmsNumber = 2222222222,
                    TeamRole = _persistanceService.UserInfo.UserRole,
                    UserPassword = _persistanceService.Password
                };
                var addUserResponse = await _userService.AddTeamUser(teamUsers, _persistanceService.Token);
                if (addUserResponse.Status == System.Net.HttpStatusCode.OK)
                {

                }

                Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Fetching team user...");

                var teamUserResponse = await _userService.GetTeamUsers(_persistanceService.UserInfo.TeamId, _persistanceService.Token);
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
                if (teamUserResponse != null && teamUserResponse.Count > 0)
                {

                }

                TeamUser updateTeamUser = new TeamUser()
                {
                    TeamId = _persistanceService.UserInfo.TeamId,
                    UserId = _persistanceService.UserInfo.UserId,
                    DateExpired = DateTime.Now,
                    FirstName = "First Name String",
                    LastName = "Last Name String",
                    EmailAddress = "email@gmail.com",
                    SmsNumber = 1111111111,
                    TeamRole = _persistanceService.UserInfo.UserRole,
                    UserPassword = _persistanceService.Password,
                    AddUserId = 0
                };
                var updateUserResponse = await _userService.UpdateTeamUser(updateTeamUser, _persistanceService.Token);
                if (updateUserResponse.Status == System.Net.HttpStatusCode.OK)
                {



                }

                TeamUser deleteTeamUser = new TeamUser()
                {
                    TeamId = _persistanceService.UserInfo.TeamId,
                    UserId = _persistanceService.UserInfo.UserId,
                    AddUserId = 0
                };
                var deleteTeamUserResponse = await _userService.DeleteTeamUser(deleteTeamUser, _persistanceService.Token);
                if (deleteTeamUserResponse.Status == System.Net.HttpStatusCode.OK)
                {



                }
            }
            catch(Exception ex)
            {
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            }
        }


        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Users");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private void SendInvite()
        {
            App.Current.MainPage.DisplayAlert("Send Invite", "Send Invite Clicked", "OK");
        }

        private void EditUser()
        {
            _navigationService.NavigateToAsync(Enums.PageKey.ManageUser);
        }

        private void NewUser()
        {
            _navigationService.NavigateToAsync(Enums.PageKey.NewUser);
        }

        private void NavigateOnNewInfo()
        {
            _navigationService.NavigateToAsync(Enums.PageKey.NewUser);
        }

        private void NavigateOnManage()
        {
            _navigationService.NavigateToAsync(Enums.PageKey.ManageUser);
        }

        private void NavigateOnInvite()
        {
            App.Current.MainPage.DisplayAlert("Invite User", "Invite User Clicked", "OK");
        }
    }
}
