using System;
using System.Collections.Generic;
using wgfapp.ViewModels;
using Xamarin.Forms;

namespace wgfapp.Views
{
    public partial class ForgotPassword : ContentPage
    {
        private readonly ForgotPasswordViewModel _forgotPasswordViewModel;
        public ForgotPassword(ForgotPasswordViewModel forgotPasswordViewModel)
        {
            InitializeComponent();
            _forgotPasswordViewModel = forgotPasswordViewModel;
            BindingContext = _forgotPasswordViewModel;
        }
    }
}
