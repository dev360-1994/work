using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class ResetPasswordViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly IUserService _userProfileService;
        private readonly IPersistanceService _persistanceService;

        private string _oldPassword;
        private string _newPassword;
        private string _retypePassword;

        public string OldPassword
        {
            get { return _oldPassword; }
            set { SetProperty(ref _oldPassword, value); }
        }

        public string NewPassword
        {
            get { return _newPassword; }
            set { SetProperty(ref _newPassword, value); }
        }

        public string RetypePassword
        {
            get { return _retypePassword; }
            set { SetProperty(ref _retypePassword, value); }
        }

        public ICommand HelpCommand { get; private set; }
        public ICommand ResetPasswordCommand { get; private set; }

        public ResetPasswordViewModel(INavigationService navigationService, IPersistanceService persistanceService, IUserService userProfileService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _userProfileService = userProfileService;
            HelpCommand = new Command(NavigateOnHelp);
            ResetPasswordCommand = new Command(ResetPassword);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "ResetPassword");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private async void ResetPassword()
        {
            if (string.IsNullOrEmpty(OldPassword) || string.IsNullOrEmpty(NewPassword))
            {
                if (string.IsNullOrEmpty(OldPassword))
                    await App.Current.MainPage.DisplayAlert("Reset Password", "Please enter old password", "OK");
                else if (string.IsNullOrEmpty(NewPassword))
                    await App.Current.MainPage.DisplayAlert("Reset Password", "Please enter new password", "OK");
                return;
            }

            if (OldPassword == NewPassword)
            {
                await App.Current.MainPage.DisplayAlert("Reset Password", "Old password and new password should not be match", "OK");
                return;
            }

            if (RetypePassword != NewPassword)
            {
                await App.Current.MainPage.DisplayAlert("Reset Password", "New password and confirm password should match", "OK");
                return;
            }

            ChangePassword requestUpdatePassword = new ChangePassword()
            {
                TeamId = _persistanceService.UserInfo.TeamId,
                UserId = _persistanceService.UserInfo.UserId,
                OldPassword = OldPassword,
                NewPassword = NewPassword
            };

            var updatePasswordResponse = await _userProfileService.UpdateUserPassword(requestUpdatePassword, _persistanceService.Token);
            if (updatePasswordResponse.Status != System.Net.HttpStatusCode.OK)
            {
                await App.Current.MainPage.DisplayAlert("Reset Password", updatePasswordResponse.Message, "OK");
                return;
            }

            await App.Current.MainPage.DisplayAlert("Reset Password", "Your password has been reset for all teams that you are part of.", "OK");
        }
    }
}
