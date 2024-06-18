using System;
using Rg.Plugins.Popup.Services;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Connect : ContentPage
    {
        private readonly ConnectViewModel _connectViewModel;

        public Connect(ConnectViewModel connectViewModel)
        {
            InitializeComponent();
            _connectViewModel = connectViewModel;
            BindingContext = _connectViewModel;
        }
    }
}