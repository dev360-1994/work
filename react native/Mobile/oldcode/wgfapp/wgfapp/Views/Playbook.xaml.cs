using System;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.PlatformConfiguration;
using Xamarin.Forms.PlatformConfiguration.AndroidSpecific;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]

    public partial class Playbook : ContentPage
    {
        private readonly PlaybookViewModel _playbookViewModel;

        string url = "https://file-examples-com.github.io/uploads/2017/10/file-example_PDF_500_kB.pdf#Page=3";

        public Playbook(PlaybookViewModel playbookViewModel)
        {
            InitializeComponent();
            _playbookViewModel = playbookViewModel;
            BindingContext = _playbookViewModel;

            if (Device.RuntimePlatform == Device.Android)
            {
                pdfView.On<Android>().EnableZoomControls(true);
                pdfView.On<Android>().DisplayZoomControls(false);

            }

            Device.BeginInvokeOnMainThread(() =>
            {
                pdfView.Uri = url;
                //pdfView.Reload();
            });

        }

        protected async override void OnAppearing()
        {
            base.OnAppearing();
            await _playbookViewModel.OnViewAppearAsync();
        }


    }
}