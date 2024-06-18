using System;
using Rg.Plugins.Popup.Services;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Documents : ContentPage
    {
        private readonly DocumentsViewModel _documentsViewModel;

        public Documents(DocumentsViewModel documentsViewModel)
        {
            InitializeComponent();
            this._documentsViewModel = documentsViewModel;
            BindingContext = _documentsViewModel;
        }
    }
}