using System;
using System.Collections.Generic;
using wgfapp.Common.Models;

namespace wgfapp.Models
{
    public class GroupedPracticeLibrary : BaseModel
    {
        private string _sportName;

        public string SportName
        {
            get { return _sportName; }
            set { SetProperty(ref _sportName, value); }
        }

        private IList<PracticeLibrary> _practiceLibraries;
        public IList<PracticeLibrary> PracticeLibraries
        {
            get { return _practiceLibraries; }
            set { SetProperty(ref _practiceLibraries, value); }
        }
    }
}
