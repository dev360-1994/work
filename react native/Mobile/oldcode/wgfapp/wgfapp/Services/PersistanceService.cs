using System;
using Newtonsoft.Json;
using wgfapp.Common.Models;
using wgfapp.Interfaces;

namespace wgfapp.Services
{
    public class PersistanceService : IPersistanceService
    {
        private const string UserEmailKey = "UserEmail";
        private const string PasswordfKey = "Password";
        private const string IsLoggedInKey = "IsLoggedIn";
        private const string UserInfoKey = "UserInfo";
        private const string ThemeKey = "Theme";
        private const string TokenKey = "Token";

        private static ISecureStorage SecureStorage { get; set; }

        private string UserJson
        {
            get => SecureStorage.GetSecuredValue(UserInfoKey);
            set => SecureStorage.SetSecuredValue(UserInfoKey, value);
        }

        public UserInfo UserInfo
        {
            get
            {
                if (string.IsNullOrEmpty(UserJson))
                    return null;

                return JsonConvert.DeserializeObject<UserInfo>(UserJson);
            }
            set { UserJson = JsonConvert.SerializeObject(value); }
        }

        public bool IsLoggedIn
        {
            get
            {
                bool _isLoggedIn = false;
                bool.TryParse(SecureStorage.GetSecuredValue(IsLoggedInKey), out _isLoggedIn);
                return _isLoggedIn;
            }

            set => SecureStorage.SetSecuredValue(IsLoggedInKey, value.ToString());
        }

        public string UserEmail
        {
            get => SecureStorage.GetSecuredValue(UserEmailKey);
            set => SecureStorage.SetSecuredValue(UserEmailKey, value);
        }

        public string Password
        {
            get => SecureStorage.GetSecuredValue(PasswordfKey);
            set => SecureStorage.SetSecuredValue(PasswordfKey, value);
        }

        public string Theme
        {
            get => SecureStorage.GetSecuredValue(ThemeKey);
            set => SecureStorage.SetSecuredValue(ThemeKey, value);
        }

        public string Token
        {
            get => SecureStorage.GetSecuredValue(TokenKey);
            set => SecureStorage.SetSecuredValue(TokenKey, value);
        }

        public PersistanceService(ISecureStorage secureStorage)
        {
            SecureStorage = secureStorage;
        }
    }
}
