using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Windows.Input;
using wgfapp.BootstrapIcons;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Service;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class LoginViewModel : BaseViewModel
    {
        private const string emailRegex = @"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$";
        private const string passwordRegex = @"^(?=.{8,16}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$";

        private readonly Regex EmailRegex = new Regex(emailRegex);
        private readonly Regex PasswordRegex = new Regex(passwordRegex);
        private readonly INavigationService _navigationService;
        private readonly IPersistanceService _persistanceService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IAccountService _loginService;

        private string _email;
        private string _password;
        private string _emailErrorMessage;
        private string _passwordErrorMessage;
        private string _errorMessage;

        private bool _isErrorMessage = false;

        private Icon _greatingIcon;

        public bool IsErrorMessage
        {
            get { return _isErrorMessage; }
            set { SetProperty(ref _isErrorMessage, value); }
        }

        public string ErrorMessage
        {
            get { return _errorMessage; }
            set { SetProperty(ref _errorMessage, value); }
        }

        public string Email
        {
            get { return _email; }
            set { SetProperty(ref _email, value); }
        }

        public string Password
        {
            get { return _password; }
            set { SetProperty(ref _password, value); }
        }

        public string EmailErrorMessage
        {
            get { return _emailErrorMessage; }
            set { SetProperty(ref _emailErrorMessage, value); }
        }

        public string PasswordErrorMessage
        {
            get { return _passwordErrorMessage; }
            set { SetProperty(ref _passwordErrorMessage, value); }
        }

        public Icon GreatingIcon
        {
            get { return _greatingIcon; }
            set { SetProperty(ref _greatingIcon, value); }
        }

        public ICommand LoginCommand { get; private set; }

        public ICommand ForgotPasswordCommand { get; private set; }

        public ICommand HelpCommand { get; private set; }

        public LoginViewModel(INavigationService navigationService, IPersistanceService persistanceService, IAuthenticationService authenticationService, IAccountService loginService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _authenticationService = authenticationService;
            _loginService = loginService;

            LoginCommand = new Command(LoginAsync);
            ForgotPasswordCommand = new Command(ForgotPassword);
            HelpCommand = new Command(NavigateOnHelp);
        }

        public void OnViewAppear()
        {
            SetGreatingIcon();
        }

        private async void LoginAsync()
        {
            try
            {
                if (string.IsNullOrEmpty(Email) || string.IsNullOrEmpty(Password))
                {
                    IsErrorMessage = false;
                    EmailErrorMessage = string.IsNullOrEmpty(Email) ? "Email is Required" : string.Empty;
                    PasswordErrorMessage = string.IsNullOrEmpty(Password) ? "Password is Required" : string.Empty;
                    return;
                }

                EmailErrorMessage = string.Empty;
                PasswordErrorMessage = string.Empty;

                // Task : 27 Point 4.
                //spnRequiredUser.Text = Email.IsMatch(username.Text) ? "Invalid email Address" : string.Empty;
                //spnRequiredPassword.Text = Password.IsMatch(password.Text) ? "The password should contain more than 8 characters,have at least one uppercase and one lowercase letter, and one number" : string.Empty;

                LoginModel loginModel = new LoginModel()
                {
                    email = Email,
                    password = Password
                };

                Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Loging...");
                var loginResponse = await _authenticationService.Login(loginModel, _persistanceService.Token);
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();

                if (loginResponse.Status != System.Net.HttpStatusCode.OK)
                {
                    IsErrorMessage = true;
                    ErrorMessage = loginResponse.Message;
                    return;
                }

                if (loginResponse.Data.TeamId >= 1)
                {
                    _persistanceService.UserEmail = Email;
                    _persistanceService.Password = Password;
                    _persistanceService.IsLoggedIn = true;
                    _persistanceService.UserInfo = loginResponse.Data;
                    IsErrorMessage = false;
                    await _navigationService.NavigateToFirstScreenAsync();
                    return;
                }

                IsErrorMessage = true;
                ErrorMessage = "We did not find a team in our database using this email address. Most likely you have have been removed from the team. Please contact your coach to be added back to the team.";
            }
            catch (Exception)
            {
                IsErrorMessage = true;
                ErrorMessage = "Some error occured. Please try again.";
            }
        }

        private async void ForgotPassword()
        {
            await _navigationService.NavigateToAsync(Enums.PageKey.ForgotPassword);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "login");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private void SetGreatingIcon()
        {
            Random random = new Random();
            int imgIndex = random.Next(1, 5);
            switch (imgIndex)
            {
                case 1:
                    GreatingIcon = Icon.EmojiSmile;
                    break;
                case 2:
                    GreatingIcon = Icon.EmojiSmileUpsideDown;
                    break;
                case 3:
                    GreatingIcon = Icon.EmojiSunglasses;
                    break;
                case 4:
                    GreatingIcon = Icon.EmojiLaughing;
                    break;
                case 5:
                    GreatingIcon = Icon.EmojiWink;
                    break;
            }
        }
    }
}
