﻿using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Payment : ContentPage
    {
        private readonly PaymentViewModel _paymentViewModel;
        public Payment(PaymentViewModel paymentViewModel)
        {
            InitializeComponent();
            _paymentViewModel = paymentViewModel;
            BindingContext = _paymentViewModel;
        }
    }
}