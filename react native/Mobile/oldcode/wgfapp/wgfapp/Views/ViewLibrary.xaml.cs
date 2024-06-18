using Rg.Plugins.Popup.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ViewLibrary : PopupPage
    {
        private readonly ViewLibraryViewModel _viewLibraryViewModel;

        public ViewLibrary(ViewLibraryViewModel viewLibraryViewModel)
        {
            InitializeComponent();
            _viewLibraryViewModel = viewLibraryViewModel;
            BindingContext = _viewLibraryViewModel;
        }

        protected async override void OnAppearing()
        {
            base.OnAppearing();
            await _viewLibraryViewModel.OnViewAppearAsync();
        }
    }
}