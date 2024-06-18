using DevExpress.XamarinForms.DataGrid;
using Rg.Plugins.Popup.Services;
using System;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class OpenExchange : ContentPage
    {
        private readonly OpenExchangeViewModel _openExchangeViewModel;
        public OpenExchange(OpenExchangeViewModel openExchangeViewModel)
        {
            InitializeComponent();
            _openExchangeViewModel = openExchangeViewModel;
            BindingContext = _openExchangeViewModel;
        }
    }
}