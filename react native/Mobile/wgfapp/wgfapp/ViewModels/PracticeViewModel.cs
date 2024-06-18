using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using TEditor;
using TEditor.Abstractions;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Models;
using wgfapp.Service.Interfaces;
using wgfapp.Views;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class PracticeViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;

        private DateTime? _selectedDate = null;
        private DateTime _currentDate;
        private Models.PracticePlan _currentPracticePlan;

        private bool _isAddNewEnable;
        private bool _isEditEnable;
        private bool _isRemoveEnable;
        private readonly IPracticePlannerService _practicePlannerService;
        private readonly IPersistanceService _persistanceService;

        public bool IsRemoveEnable
        {
            get { return _isRemoveEnable; }
            set { SetProperty(ref _isRemoveEnable, value); }
        }

        public bool IsEditEnable
        {
            get { return _isEditEnable; }
            set { SetProperty(ref _isEditEnable, value); }
        }

        public bool IsAddNewEnable
        {
            get { return _isAddNewEnable; }
            set { SetProperty(ref _isAddNewEnable, value); }
        }

        public DateTime CurrentDate
        {
            get { return _currentDate; }
            set
            {
                SetProperty(ref _currentDate, value);
            }
        }

        public Models.PracticePlan CurrentPracticePlan
        {
            get { return _currentPracticePlan; }
            set { SetProperty(ref _currentPracticePlan, value); }
        }

        public ICommand EditTemplateCommnad { get; private set; }
        public ICommand UploadTemplateCommnad { get; private set; }
        public ICommand ViewLibraryCommnad { get; private set; }
        public ICommand HelpCommand { get; private set; }
        public ICommand PreviousDateCommand { get; private set; }
        public ICommand NextDateCommand { get; private set; }
        public ICommand AddNewCommand { get; private set; }
        public ICommand EditCommand { get; private set; }
        public ICommand RemoveCommand { get; private set; }

        public PracticeViewModel(INavigationService navigationService, IPersistanceService persistanceService, IPracticePlannerService practicePlannerService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _practicePlannerService = practicePlannerService;
            HelpCommand = new Command(NavigateOnHelp);
            EditTemplateCommnad = new Command(OnEditTemplate);
            UploadTemplateCommnad = new Command(OnUploadTemplate);
            ViewLibraryCommnad = new Command(OnViewLibrary);
            PreviousDateCommand = new Command(OnPreviousDate);
            NextDateCommand = new Command(OnNextDate);
            AddNewCommand = new Command(OnAddNew);
            EditCommand = new Command(OnEdit);
            RemoveCommand = new Command(OnRemove);
        }

        public async Task OnViewAppearAsync()
        {
            if (_selectedDate == null)
            {
                CurrentDate = DateTime.Now;
                _selectedDate = CurrentDate;
            }

            CurrentPracticePlan = await GetPracticePlansAsync();
            EnableDisableBottomButtons();
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Practice");
            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private async void OnEditTemplate()
        {
            CrossTEditor.SaveText = "Save";
            CrossTEditor.CancelText = "Cancel";
            TEditorResponse response = await CrossTEditor.Current.ShowTEditor(CurrentPracticePlan.Html.Html);
            if (response.IsSave && response.HTML != null)
            {
                CurrentPracticePlan.Html = new HtmlWebViewSource() { Html = response.HTML };
            }
        }

        private void OnUploadTemplate()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "UploadTemplate");
            _navigationService.PushPopupAsync(Enums.PageKey.UploadTemplate, parameters);
        }

        private void OnViewLibrary()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "ViewLibrary");
            _navigationService.PushPopupAsync(Enums.PageKey.ViewLibrary, parameters);
        }

        private async void OnPreviousDate()
        {
            CurrentDate = CurrentDate.AddDays(-1);
            CurrentPracticePlan = await GetPracticePlansAsync();
            EnableDisableBottomButtons();
        }

        private async void OnNextDate()
        {
            CurrentDate = CurrentDate.AddDays(1);
            CurrentPracticePlan = await GetPracticePlansAsync();
            EnableDisableBottomButtons();
        }

        private async void OnAddNew()
        {
            try
            {
                Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Adding new practice plan...");
                RequestPracticePlanModel requestPracticePlanModel = new RequestPracticePlanModel()
                {
                    TeamId = _persistanceService.UserInfo.TeamId
                };

                var fetchPlan = await _practicePlannerService.GetPracticeTemplate(requestPracticePlanModel, _persistanceService.Token);

                if (fetchPlan.Status != System.Net.HttpStatusCode.OK)
                {
                    Acr.UserDialogs.UserDialogs.Instance.HideLoading();
                    await App.Current.MainPage.DisplayAlert("Not Found", fetchPlan.Message, "OK");
                    return;
                }

                Common.Models.PracticePlanner requestInsertPracticePlan = new Common.Models.PracticePlanner()
                {
                    TeamId = _persistanceService.UserInfo.TeamId,
                    UserId = _persistanceService.UserInfo.UserId,
                    PracticeDate = CurrentDate,
                    PracticePlan = fetchPlan.Data
                };

                var plannerResponse = await _practicePlannerService.InsertPracticePlanner(requestInsertPracticePlan, _persistanceService.Token);
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();

                if (plannerResponse.Status != System.Net.HttpStatusCode.OK)
                {
                    await App.Current.MainPage.DisplayAlert("Not Found", plannerResponse.Message, "OK");
                    return;
                }
                await App.Current.MainPage.DisplayAlert("Suceess", plannerResponse.Message, "OK");

                CurrentPracticePlan = new Models.PracticePlan()
                {
                    Html = new HtmlWebViewSource() { Html = fetchPlan.Data },
                    PlanDate = CurrentDate
                };
                EnableDisableBottomButtons();
            }
            catch(Exception ex)
            {
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            }
        }

        private async void OnEdit()
        {
            try
            {
                CrossTEditor.SaveText = "Save";
                CrossTEditor.CancelText = "Cancel";
                TEditorResponse response = await CrossTEditor.Current.ShowTEditor(CurrentPracticePlan.Html.Html);
                if (response.IsSave && response.HTML != null)
                {
                    Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Updating practice plan...");

                    Common.Models.PracticePlanner requestInsertPracticePlan = new Common.Models.PracticePlanner()
                    {
                        TeamId = _persistanceService.UserInfo.TeamId,
                        UserId = _persistanceService.UserInfo.UserId,
                        PracticeDate = CurrentDate,
                        PracticePlan = $"{response.HTML}",
                    };

                    var plannerResponse = await _practicePlannerService.UpdatePracticePlanner(requestInsertPracticePlan, _persistanceService.Token);
                    Acr.UserDialogs.UserDialogs.Instance.HideLoading();

                    if (plannerResponse.Status != System.Net.HttpStatusCode.OK)
                    {
                        await App.Current.MainPage.DisplayAlert("Not Found", plannerResponse.Message, "OK");
                        return;
                    }
                    CurrentPracticePlan.Html = new HtmlWebViewSource() { Html = response.HTML };
                    await App.Current.MainPage.DisplayAlert("Suceess", plannerResponse.Message, "OK");
                }
            }
            catch(Exception ex)
            {
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            }
        }

        private async void OnRemove()
        {
            try
            {
                var action = await App.Current.MainPage.DisplayAlert("Delete", "Are you sure you want to delete this practice plan?", "Yes", "No");
                if (action)
                {
                    Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Removing practice plan...");
                    Common.Models.PracticePlanner requestInsertPracticePlan = new Common.Models.PracticePlanner()
                    {
                        TeamId = _persistanceService.UserInfo.TeamId,
                        UserId = _persistanceService.UserInfo.UserId,
                        PracticeDate = CurrentDate,
                        PracticePlan = CurrentPracticePlan.Html.Html
                    };

                    var plannerResponse = await _practicePlannerService.DeletePracticePlanner(requestInsertPracticePlan, _persistanceService.Token);
                    Acr.UserDialogs.UserDialogs.Instance.HideLoading();

                    if (plannerResponse.Status != System.Net.HttpStatusCode.OK)
                    {
                        await App.Current.MainPage.DisplayAlert("Not Found", plannerResponse.Message, "OK");
                        return;
                    }
                    CurrentPracticePlan = null;
                    EnableDisableBottomButtons();
                    await App.Current.MainPage.DisplayAlert("Suceess", plannerResponse.Message, "OK");
                }
            }
            catch(Exception ex)
            {
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            }
        }

        private void EnableDisableBottomButtons()
        {
            _selectedDate = CurrentDate;
            IsAddNewEnable = CurrentPracticePlan == null;
            IsEditEnable = CurrentPracticePlan != null;
            IsRemoveEnable = CurrentPracticePlan != null;

            if (CurrentPracticePlan != null)
                return;

            CurrentPracticePlan = new Models.PracticePlan()
            {
                Html = new HtmlWebViewSource() { Html = "" },
                PlanDate = CurrentDate
            };
        }

        private async Task<Models.PracticePlan> GetPracticePlansAsync()
        {
            try
            {
                Models.PracticePlan practicePlan = null;
                Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Fetching practice plan...");
                RequestPracticePlanModel requestPracticePlanModel = new RequestPracticePlanModel()
                {
                    TeamId = _persistanceService.UserInfo.TeamId,
                    PracticeDate = CurrentDate.ToString("MM-dd-yyyy")
                };

                var plannerResponse = await _practicePlannerService.GetPracticePlanner(requestPracticePlanModel, _persistanceService.Token);
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();

                if (plannerResponse.Status == System.Net.HttpStatusCode.OK)
                {
                    practicePlan = new Models.PracticePlan()
                    {
                        PlanDate = CurrentDate,
                        Html = new HtmlWebViewSource() { Html = plannerResponse.Data }
                    };
                }

                return practicePlan;
            }
            catch (Exception ex)
            {
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
                return null;
            }
        }
    }
}
