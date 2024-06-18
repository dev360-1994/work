using System;
using Rg.Plugins.Popup.Services;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class LearningVideos : ContentPage
    {
        private readonly LearningVideosViewModel _learningVideosViewModel;

        public LearningVideos(LearningVideosViewModel learningVideosViewModel)
        {
            InitializeComponent();
            _learningVideosViewModel = learningVideosViewModel;
            BindingContext = _learningVideosViewModel;
        }
    }
}