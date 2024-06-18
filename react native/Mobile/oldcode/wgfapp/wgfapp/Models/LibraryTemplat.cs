using System;
using System.Collections.Generic;
using Xamarin.Forms;

namespace wgfapp.Models
{
    public class LibraryTemplate : BaseModel
    {
        private string _sportName;
        private string _parterName;
        private string _description;
        private string _templateId;
        private List<HtmlWebViewSource> _templates;

        public string SportName
        {
            get { return _sportName; }
            set { SetProperty(ref _sportName, value); }
        }

        public string ParterName
        {
            get { return _parterName; }
            set { SetProperty(ref _parterName, value); }
        }

        public string Description
        {
            get { return _description; }
            set { SetProperty(ref _description, value); }
        }

        public List<HtmlWebViewSource> Templates
        {
            get { return _templates; }
            set { SetProperty(ref _templates, value); }
        }

        public string TemplateId
        {
            get { return _description; }
            set { SetProperty(ref _description, value); }
        }
    }

    public class Template : BaseModel
    {
        private HtmlWebViewSource _html;
        public HtmlWebViewSource Html
        {
            get { return _html; }
            set { SetProperty(ref _html, value); }
        }
    }
}