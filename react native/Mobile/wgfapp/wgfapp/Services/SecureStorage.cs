using System;
using System.Threading.Tasks;
using wgfapp.Interfaces;
using Xamarin.Essentials;

namespace wgfapp.Services
{
    public class SecureStorageService : ISecureStorage
    {
        public async Task<string> GetSecuredValueAsync(string key)
        {
            try
            {
                var securedValue = await SecureStorage.GetAsync(key);
                return securedValue;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Exception in Secure Storage : {ex.Message}");
                throw new NotSupportedException(ex.Message, ex);
            }
        }

        public async Task SetSecuredValueAsync(string key, string value)
        {
            try
            {
                await SecureStorage.SetAsync(key, value);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Exception in Secure Storage : {ex.Message}");
                //throw new NotSupportedException(ex.Message, ex);
            }
        }

        public string GetSecuredValue(string key)
        {
            try
            {
                var securedValueTask = SecureStorage.GetAsync(key);
                var securedValue = securedValueTask.Result;
                return securedValue;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Exception in Secure Storage : {ex.Message}");
                throw new NotSupportedException(ex.Message, ex);
            }
        }

        public void SetSecuredValue(string key, string value)
        {
            try
            {
                SecureStorage.SetAsync(key, value);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Exception in Secure Storage : {ex.Message}");
                //throw new NotSupportedException(ex.Message, ex);
            }
        }

        public bool RemoveSecuredValue(string key)
        {
            return SecureStorage.Remove(key);
        }

        public void RemoveAllValues()
        {
            SecureStorage.RemoveAll();
        }
    }
}
