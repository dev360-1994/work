using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Models;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class ViewLibraryViewModel : BasePopupViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly IPracticePlannerService _practicePlannerService;
        private readonly IPersistanceService _persistanceService;

        private IList<GroupedPracticeLibrary> _sports;
        public IList<GroupedPracticeLibrary> Sports
        {
            get { return _sports; }
            set { SetProperty(ref _sports, value); }
        }

        private HtmlWebViewSource _htmlPracticePlan;
        public HtmlWebViewSource HtmlPracticePlan
        {
            get { return _htmlPracticePlan; }
            set { SetProperty(ref _htmlPracticePlan, value); }
        }

        private GroupedPracticeLibrary _selectedSports;
        public GroupedPracticeLibrary SelectedSports
        {
            get { return _selectedSports; }
            set { SetProperty(ref _selectedSports, value); }
        }

        private PracticeLibrary _currentlySelectedLibraryTemplate;
        public PracticeLibrary CurrentlySelectedLibraryTemplate
        {
            get { return _currentlySelectedLibraryTemplate; }
            set { SetProperty(ref _currentlySelectedLibraryTemplate, value); }
        }

        private int _totalTemplates;
        public int TotalTemplates
        {
            get { return _totalTemplates; }
            set { SetProperty(ref _totalTemplates, value); }

        }

        private int _templateIndex;
        public int TemplateIndex
        {
            get { return _templateIndex; }
            set { SetProperty(ref _templateIndex, value); }

        }

        private string _templateIndexAndCount;
        public string TemplateIndexAndCount
        {
            get { return _templateIndexAndCount; }
            set { SetProperty(ref _templateIndexAndCount, value); }
        }

        public ICommand CloseCommand { get; set; }
        public ICommand SaveDraftCommand { get; set; }
        public ICommand PreviousCommand { get; private set; }
        public ICommand NextCommand { get; private set; }
        public ICommand SportGroupChanged { get; private set; }

        public ViewLibraryViewModel(INavigationService navigationService, IPersistanceService persistanceService, IPracticePlannerService practicePlannerService) : base(navigationService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _practicePlannerService = practicePlannerService;
            PopupTitle = "View Library";
            CloseCommand = new Command(OnClose);
            SaveDraftCommand = new Command(OnSaveDraft);
            PreviousCommand = new Command(OnPrevious);
            NextCommand = new Command(OnNext);
            SportGroupChanged = new Command(OnSportGroupSelectionChanged);
        }

        public async Task OnViewAppearAsync()
        {
            Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Fetching library plan...");
            var practiceLibraries = await _practicePlannerService.GetPracticeLibrary(_persistanceService.Token);

            //var practiceLibraries = BindSportsData();
            Sports = practiceLibraries.GroupBy(x => x.Sport).Select(y => new GroupedPracticeLibrary()
            {
                SportName = y.Key,
                PracticeLibraries = y.Select(z => z).ToList()
            }).ToList();
            SelectedSports = Sports.FirstOrDefault();
            Acr.UserDialogs.UserDialogs.Instance.HideLoading();
        }


        private void OnPrevious()
        {
            if (SelectedSports == null || TemplateIndex == 0)
                return;

            TemplateIndex--;
            SetTemplateCountAndCurrentTemplate();
        }

        private void OnNext()
        {
            if (SelectedSports == null || TemplateIndex >= (SelectedSports.PracticeLibraries.Count - 1))
                return;

            TemplateIndex++;
            SetTemplateCountAndCurrentTemplate();
        }

        private void OnSportGroupSelectionChanged()
        {
            if (SelectedSports == null)
                return;

            TemplateIndex = 0;
            TotalTemplates = SelectedSports.PracticeLibraries.Count;
            SetTemplateCountAndCurrentTemplate();
        }

        private void SetTemplateCountAndCurrentTemplate()
        {
            TemplateIndexAndCount = $"{TemplateIndex + 1} of {TotalTemplates}";
            CurrentlySelectedLibraryTemplate = SelectedSports.PracticeLibraries[TemplateIndex];
            HtmlPracticePlan = new HtmlWebViewSource() { Html = CurrentlySelectedLibraryTemplate.PracticePlan };

        }

        private void OnClose()
        {
            _navigationService.PopModalAsync();
        }

        private async void OnSaveDraft()
        {
            RequestPracticeLibraryUpdate requestPracticeLibraryUpdate = new RequestPracticeLibraryUpdate()
            {
                TeamId = _persistanceService.UserInfo.TeamId,
                UserId = _persistanceService.UserInfo.UserId,
                TemplateId = Convert.ToInt32(CurrentlySelectedLibraryTemplate.TemplateId)
            };

            Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Saving template...");
            var updateTemplateResponse = await _practicePlannerService.UpdatePraticeLibraryTamplate(requestPracticeLibraryUpdate, _persistanceService.Token);
            Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            if (updateTemplateResponse.Status != HttpStatusCode.OK)
            {
                await App.Current.MainPage.DisplayAlert("Not Save", updateTemplateResponse.Message, "OK");
                return;
            }

            await App.Current.MainPage.DisplayAlert("Saved", updateTemplateResponse.Message, "OK");
        }

        public List<PracticeLibrary> BindSportsData()
        {
            var sports = new List<PracticeLibrary>()
            {
                new PracticeLibrary() { Sport = "Basketball", ConnectName = "Basketball Partner", PracticeDesc = "Basketball Description", TemplateId = 1 },

                new PracticeLibrary() {Sport = "Tennis", ConnectName = "Tennis Partner", PracticeDesc = "Tennis Description", TemplateId = 2  },

                new PracticeLibrary() {Sport = "Basketball", ConnectName = "Badminton Partner", PracticeDesc = "Badminton Description", TemplateId = 3 },

                new PracticeLibrary() {Sport = "Volleyball", ConnectName = "Volleyball Partner", PracticeDesc = "Volleyball Description", TemplateId = 4 },

                new PracticeLibrary() {Sport = "Tennis", ConnectName = "Football Partner", PracticeDesc = "Football Description", TemplateId = 5 },

                new PracticeLibrary() {Sport = "Basketball", ConnectName = "Gymnastics Partner", PracticeDesc = "Gymnastics Description", TemplateId = 6 },

                new PracticeLibrary() {Sport = "Cricket", ConnectName = "Cricket Partner", PracticeDesc = "Cricket Description", TemplateId = 7 },
            };

            return sports;
        }
    }
}
