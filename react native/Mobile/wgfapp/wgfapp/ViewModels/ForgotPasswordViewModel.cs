using System;
using System.Windows.Input;
using Acr.UserDialogs;
using wgfapp.Service;
using wgfapp.Utilities;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class ForgotPasswordViewModel : BaseViewModel
    {
        private readonly IAuthenticationService _authenticationService;

        private string _emailAddress;
        private string _errorMessage;

        private bool _hasError;

        public string EmailAddress
        {
            get { return _emailAddress; }
            set { SetProperty(ref _emailAddress, value); }
        }

        public string ErrorMessage
        {
            get { return _errorMessage; }
            set { SetProperty(ref _errorMessage, value); }
        }

        public bool HasError
        {
            get { return _hasError; }
            set { SetProperty(ref _hasError, value); }
        }

        public ICommand SendResetPasswordEmailCommand { get; private set; }

        public ForgotPasswordViewModel(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
            SendResetPasswordEmailCommand = new Command(SendResetPasswordEmail);
        }

        private async void SendResetPasswordEmail()
        {
            HasError = false;
            if (!Validation.IsValidEmailAddress(EmailAddress))
            {
                HasError = true;
                ErrorMessage = "Invalid email address.";
                return;
            }

            UserDialogs.Instance.ShowLoading("Processing...");
            var apiResponse = await _authenticationService.ForgotPassword(EmailAddress);
            UserDialogs.Instance.HideLoading();

            if(apiResponse!=null & apiResponse.Data == true)
            {
                this.EmailAddress = string.Empty;
            }
            UserDialogs.Instance.Alert(apiResponse.Message);
        }
    }
}
