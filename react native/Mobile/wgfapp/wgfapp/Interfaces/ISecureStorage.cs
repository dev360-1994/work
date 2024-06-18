using System;
using System.Threading.Tasks;

namespace wgfapp.Interfaces
{
    public interface ISecureStorage
    {
        Task<string> GetSecuredValueAsync(string key);

        Task SetSecuredValueAsync(string key, string value);

        string GetSecuredValue(string key);

        void SetSecuredValue(string key, string value);

        bool RemoveSecuredValue(string key);

        void RemoveAllValues();
    }
}
