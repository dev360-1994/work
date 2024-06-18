using System;
using Rg.Plugins.Popup.Services;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Highlights : ContentPage
    {
        private readonly HighlightsViewModel _highlightsViewModel;

        public Highlights(HighlightsViewModel highlightsViewModel)
        {
            InitializeComponent();
            _highlightsViewModel = highlightsViewModel;
            BindingContext = _highlightsViewModel;
        }
    }
}