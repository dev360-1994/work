using System;
using DevExpress.XamarinForms.DataGrid;
using Rg.Plugins.Popup.Services;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class AddLocker : ContentPage
    {
        private readonly AddLockerViewModel _addLockerViewModel;

        public AddLocker(AddLockerViewModel addLockerViewModel)
        {
            InitializeComponent();
            _addLockerViewModel = addLockerViewModel;
            BindingContext = _addLockerViewModel;
        }
    }
}