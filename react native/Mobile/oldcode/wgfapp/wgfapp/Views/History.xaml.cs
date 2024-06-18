using System;
using Rg.Plugins.Popup.Services;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class History : ContentPage
    {
        private readonly HistoryViewModel _historyViewModel;

        public History(HistoryViewModel historyViewModel)
        {
            InitializeComponent();
            _historyViewModel = historyViewModel;
            BindingContext = _historyViewModel;
        }

        protected async override void OnAppearing()
        {
            base.OnAppearing();

            await _historyViewModel.OnViewAppearAsync();
        }
    }
}