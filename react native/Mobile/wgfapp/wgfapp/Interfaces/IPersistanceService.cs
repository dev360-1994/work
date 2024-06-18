using System;
using wgfapp.Common.Models;

namespace wgfapp.Interfaces
{
    public interface IPersistanceService
    {
        bool IsLoggedIn { get; set; }

        string UserEmail { get; set; }

        string Password { get; set; }

        string Theme { get; set; }

        string Token { get; set; }

        string SelectedColor { get; set; }

        UserInfo UserInfo { get; set; }
    }
}
