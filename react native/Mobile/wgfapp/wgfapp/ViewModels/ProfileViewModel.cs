using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using wgfapp.Common.Models;
using wgfapp.Enums;
using wgfapp.Interfaces;
using wgfapp.Models;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class ProfileViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly IUserService _userProfileService;
        private readonly IPersistanceService _persistanceService;

        public ICommand HelpCommand { get; private set; }
        public ICommand LeaveTeamCommand { get; private set; }
        public ICommand ResetPasswordCommand { get; private set; }
        public ICommand SaveProfileCommand { get; private set; }

        List<WGf> notificationPreference;
        public List<WGf> NotificationPreference
        {
            get { return notificationPreference; }
            set { SetProperty(ref notificationPreference, value); }
        }

        List<WGf> _receiveNotification;
        public List<WGf> ReceiveNotification
        {
            get { return _receiveNotification; }
            set { SetProperty(ref _receiveNotification, value); }
        }

        WGf _selectedNotificationPreference;
        public WGf SelectedNotificationPreference
        {
            get { return _selectedNotificationPreference; }
            set { SetProperty(ref _selectedNotificationPreference, value); }
        }

        WGf _selectedReceiveNotification;
        public WGf SelectedReceiveNotification
        {
            get { return _selectedReceiveNotification; }
            set { SetProperty(ref _selectedReceiveNotification, value); }
        }

        private string _firstName;
        public string FirstName
        {
            get { return _firstName; }
            set { SetProperty(ref _firstName, value); }
        }

        private string _lastName;
        public string LastName
        {
            get { return _lastName; }
            set { SetProperty(ref _lastName, value); }
        }

        private string _email;
        public string Email
        {
            get { return _email; }
            set { SetProperty(ref _email, value); }
        }

        private string _mobile;
        public string Mobile
        {
            get { return _mobile; }
            set { SetProperty(ref _mobile, value); }
        }


        public ProfileViewModel(INavigationService navigationService, IPersistanceService persistanceService, IUserService userProfileService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _userProfileService = userProfileService;
            NotificationPreference = new List<WGf>()
            {
                new WGf {Name = NotificationPreferece.EmailAndPhone.ToString()},
                new WGf {Name = NotificationPreferece.EmailOnly.ToString()},
                new WGf {Name = NotificationPreferece.PhoneOnly.ToString()}
            };

            ReceiveNotification = new List<WGf>()
            {
                new WGf {Name = NotificationStatus.Block.ToString()},
                new WGf {Name = NotificationStatus.Receive.ToString()},
            };

            HelpCommand = new Command(NavigateOnHelp);
            LeaveTeamCommand = new Command(LeaveTeam);
            ResetPasswordCommand = new Command(ResetPassword);
            SaveProfileCommand = new Command(SaveProfile);

        }

        public async Task OnViewAppearAsync()
        {
            try
            {
                Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Fetching profile...");
                BaseUserInfo baseUserInfo = new BaseUserInfo()
                {
                    TeamId = _persistanceService.UserInfo.TeamId,
                    UserId = _persistanceService.UserInfo.UserId,
                };

                var profileResponse = await _userProfileService.GetUserProfile(baseUserInfo, _persistanceService.Token);
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
                if (profileResponse != null)
                {
                    FirstName = profileResponse.FirstName;
                    LastName = profileResponse.LastName;
                    Mobile = profileResponse.Phone;
                    Email = profileResponse.Email;
                    SelectedNotificationPreference = NotificationPreference[profileResponse.Prefference];
                    if (profileResponse.Dnc >= 0)
                        SelectedReceiveNotification = ReceiveNotification[profileResponse.Dnc];
                    else
                        SelectedReceiveNotification = ReceiveNotification[0];
                }

                var userRolesResponse = await _userProfileService.GetUserRoles(_persistanceService.Token);
                if (userRolesResponse != null && userRolesResponse.Count > 0)
                {
                }

                UserProfile userProfile = new UserProfile()
                {
                    UserId = _persistanceService.UserInfo.UserId
                };

                var userTeamsResponse = await _userProfileService.GetUserTeams(_persistanceService.UserInfo.UserId, _persistanceService.Token);
                if (userTeamsResponse != null && userTeamsResponse.Count > 0)
                {

                }
            }
            catch (Exception ex)
            {
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            }
        }

        private async void SaveProfile()
        {

           try
            {
                if (string.IsNullOrEmpty(FirstName) || string.IsNullOrEmpty(LastName) || SelectedNotificationPreference == null || SelectedReceiveNotification == null)
                {
                    if (string.IsNullOrEmpty(FirstName))
                        await App.Current.MainPage.DisplayAlert("Update Profile", "Please enter first name", "OK");
                    else if (string.IsNullOrEmpty(LastName))
                        await App.Current.MainPage.DisplayAlert("Update Profile", "Please enter last name", "OK");
                    else if (SelectedNotificationPreference == null)
                        await App.Current.MainPage.DisplayAlert("Update Profile", "Please select notification preference", "OK");
                    else if (SelectedReceiveNotification == null)
                        await App.Current.MainPage.DisplayAlert("Update Profile", "Please select notification Status", "OK");
                };

                Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Updating profile...");

                UserProfile requestUpdateProfile = new UserProfile()
                {
                    FirstName = FirstName,
                    LastName = LastName,
                    Phone = Mobile,
                    Email = Email,
                    Prefference = NotificationPreference.IndexOf(SelectedNotificationPreference),
                    Dnc = ReceiveNotification.IndexOf(SelectedReceiveNotification),
                    UserId = _persistanceService.UserInfo.UserId,
                    UserPassword = _persistanceService.Password
                };

                var profileResponse = await _userProfileService.UpdateUserProfile(requestUpdateProfile, _persistanceService.Token);
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
                if (profileResponse.Status != System.Net.HttpStatusCode.OK)
                {
                    await App.Current.MainPage.DisplayAlert("Update Profile", profileResponse.Message, "OK");
                    return;
                }
                _persistanceService.UserEmail = Email;
                _persistanceService.UserInfo.FirstName = FirstName;
                _persistanceService.UserInfo.LastName = LastName;
                await App.Current.MainPage.DisplayAlert("Update Profile", "Your profile has been updated.", "OK");
            }
            catch(Exception ex)
            {
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            }
        }

        private async void ResetPassword()
        {
            await _navigationService.NavigateToAsync(Enums.PageKey.ResetPassword);
        }

        private async void LeaveTeam()
        {
            var action = await App.Current.MainPage.DisplayAlert("Leave Team Confirmation", "Should you leave, you are automatically logged out and no longer able to sign into this team.  Continue?", "Yes", "No");
            if (!action)
                return;

            BaseUserInfo baseUserInfo = new BaseUserInfo()
            {
                TeamId = _persistanceService.UserInfo.TeamId,
                UserId = _persistanceService.UserInfo.UserId,
            };

            Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Leaving team...");
            var profileResponse = await _userProfileService.LeaveTeam(baseUserInfo, _persistanceService.Token);
            Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            if (profileResponse.Status != System.Net.HttpStatusCode.OK)
            {
                await App.Current.MainPage.DisplayAlert("Profile", profileResponse.Message, "OK");
                return;
            }
            _persistanceService.UserEmail = "";
            _persistanceService.Password = "";
            _persistanceService.IsLoggedIn = false;
            _persistanceService.UserInfo = null;
            await _navigationService.NavigateToFirstScreenAsync();
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Profile");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }
    }
}
