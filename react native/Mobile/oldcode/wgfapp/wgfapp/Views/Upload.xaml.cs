using Plugin.Media;
using System;
using System.Threading.Tasks;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Upload : ContentPage
    {
        private readonly UploadViewModel _uploadViewModel;
        public Upload(UploadViewModel uploadViewModel)
        {
            InitializeComponent();
            _uploadViewModel = uploadViewModel;
            BindingContext = _uploadViewModel;
        }
    }
}