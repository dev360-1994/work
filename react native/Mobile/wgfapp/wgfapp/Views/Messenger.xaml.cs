using Rg.Plugins.Popup.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using wgfapp.ViewModels;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Messenger : ContentPage
    {
        private readonly MessengerViewModel _messengerViewModel;
        public Messenger(MessengerViewModel messengerViewModel)
        {
            InitializeComponent();
            _messengerViewModel = messengerViewModel;
            BindingContext = _messengerViewModel;
        }
    }
}