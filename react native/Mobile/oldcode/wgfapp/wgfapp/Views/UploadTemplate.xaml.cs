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
    public partial class UploadTemplate : PopupPage
    {
        private readonly UploadTemplateViewModel _uploadTemplateViewModel;

        public UploadTemplate(UploadTemplateViewModel uploadTemplateViewModel)
        {
            InitializeComponent();
            _uploadTemplateViewModel = uploadTemplateViewModel;
            BindingContext = _uploadTemplateViewModel;
        }
    }
}