using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RestSharp;
using wgfapp.Common.Interfaces;
using wgfapp.Common.Models;

namespace wgfapp.Service
{
    public abstract class BaseAPIService
    {
        private readonly RestClient _client;
        private readonly string _apiKey;
        private readonly string _apiBaseUrl;
        private readonly IConfig _config;

        public BaseAPIService(IConfig config)
        {
            _config = config;
            _client = new RestClient();
            _apiKey = _config.APIKey;
            _apiBaseUrl = _config.BaseUrl;
            SetBaseUrlAndTimeout(_apiBaseUrl, _config.TimeoutInMilliseconds);
        }

        protected void SetBaseUrlAndTimeout(string baseUrl, int timeoutInMilliseconds = 180000)
        {
            _client.BaseUrl = new Uri(baseUrl);
            _client.Timeout = timeoutInMilliseconds;
        }

        protected RestClient GetClient()
        {
            return _client;
        }

        protected async Task<T> PostRequest<T>(string urlSegment, object requestBody, string token, CancellationToken cancellationToken = default(CancellationToken))
        {
            RestRequest request = new RestRequest(urlSegment);
            request.Method = Method.POST;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Authorization", $"Bearer {token}");

            if (requestBody != null)
                request.AddJsonBody(requestBody);

            IRestResponse apiResponse = null;
            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                apiResponse = await _client.ExecuteAsync(request, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
                return JsonConvert.DeserializeObject<T>(apiResponse.Content);
            }
            catch (Newtonsoft.Json.JsonSerializationException jse)
            {
                ErrorResponse error = apiResponse != null ? JsonConvert.DeserializeObject<ErrorResponse>(apiResponse.Content) : null;
                if (error != null)
                    throw new Exception(error.Message);

                throw jse;
            }
            catch (TaskCanceledException ex)
            {
                throw ex;
            }
            catch (Exception e)
            {
                ErrorResponse error = apiResponse != null ? JsonConvert.DeserializeObject<ErrorResponse>(apiResponse.Content) : null;
                if (error != null)
                    throw new Exception(error.Message);

                throw e;
            }
        }

        protected async Task<T> PostRequest<T>(string urlSegment, object requestBody, CancellationToken cancellationToken = default(CancellationToken))
        {
            RestRequest request = new RestRequest(urlSegment);
            request.Method = Method.POST;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("apiKey", _apiKey);

            if (requestBody != null)
                request.AddJsonBody(requestBody);

            IRestResponse apiResponse = null;
            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                apiResponse = await _client.ExecuteAsync(request, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
                return JsonConvert.DeserializeObject<T>(apiResponse.Content);
            }
            catch (Newtonsoft.Json.JsonSerializationException jse)
            {
                ErrorResponse error = apiResponse != null ? JsonConvert.DeserializeObject<ErrorResponse>(apiResponse.Content) : null;
                if (error != null)
                    throw new Exception(error.Message);

                throw jse;
            }
            catch (TaskCanceledException ex)
            {
                throw ex;
            }
            catch (Exception e)
            {
                ErrorResponse error = apiResponse != null ? JsonConvert.DeserializeObject<ErrorResponse>(apiResponse.Content) : null;
                if (error != null)
                    throw new Exception(error.Message);

                throw e;
            }
        }

        protected async Task<T> PutRequest<T>(string urlSegment, object requestBody, string token, CancellationToken cancellationToken = default(CancellationToken))
        {
            RestRequest request = new RestRequest(urlSegment);
            request.Method = Method.PUT;
            request.AddHeader("Accept", "application/json");
            if (!string.IsNullOrEmpty(token))
                request.AddHeader("Authorization", $"Bearer {token}");

            if (requestBody != null)
                request.AddJsonBody(requestBody);

            IRestResponse apiResponse = null;
            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                apiResponse = await _client.ExecuteAsync(request, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
                return JsonConvert.DeserializeObject<T>(apiResponse.Content);
            }
            catch (Newtonsoft.Json.JsonSerializationException jse)
            {
                ErrorResponse error = apiResponse != null ? JsonConvert.DeserializeObject<ErrorResponse>(apiResponse.Content) : null;
                if (error != null)
                    throw new Exception(error.Message);

                throw jse;
            }
            catch (TaskCanceledException ex)
            {
                throw ex;
            }
            catch (Exception e)
            {
                ErrorResponse error = apiResponse != null ? JsonConvert.DeserializeObject<ErrorResponse>(apiResponse.Content) : null;
                if (error != null)
                    throw new Exception(error.Message);

                throw e;
            }
        }

        protected async Task<T> DeleteRequest<T>(string urlSegment, string token, IDictionary<string, object> parameters = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            RestRequest request = new RestRequest(urlSegment);
            request.Method = Method.DELETE;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Authorization", $"Bearer {token}");


            if (parameters != null && parameters.Count > 0)
            {
                foreach (var item in parameters)
                {
                    request.AddParameter(item.Key, item.Value);
                }
            }
            //if (requestBody != null)
            //    request.AddJsonBody(requestBody);

            IRestResponse apiResponse = null;
            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                apiResponse = await _client.ExecuteAsync(request, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
                return JsonConvert.DeserializeObject<T>(apiResponse.Content);
            }
            catch (Newtonsoft.Json.JsonSerializationException jse)
            {
                ErrorResponse error = apiResponse != null ? JsonConvert.DeserializeObject<ErrorResponse>(apiResponse.Content) : null;
                if (error != null)
                    throw new Exception(error.Message);

                throw jse;
            }
            catch (TaskCanceledException ex)
            {
                throw ex;
            }
            catch (Exception e)
            {
                ErrorResponse error = apiResponse != null ? JsonConvert.DeserializeObject<ErrorResponse>(apiResponse.Content) : null;
                if (error != null)
                    throw new Exception(error.Message);

                throw e;
            }
        }

        protected async Task<T> GetRequest<T>(string urlSegment, string token, IDictionary<string, object> parameters = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            RestRequest request = new RestRequest(urlSegment);
            request.Method = Method.GET;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Authorization", $"Bearer {token}");

            if (parameters != null && parameters.Count > 0)
            {
                foreach (var item in parameters)
                {
                    request.AddParameter(item.Key, item.Value);
                }
            }

            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                var apiResponse = await _client.ExecuteAsync(request, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
                var returnObject = JsonConvert.DeserializeObject<T>(apiResponse.Content);
                return returnObject;
            }
            catch (System.Net.Http.HttpRequestException ex)
            {
                throw ex;
            }
            catch (TaskCanceledException ex)
            {
                throw ex;
            }
        }

        protected async Task<IRestResponse> GetRequest(string urlSegment, string token, IDictionary<string, object> parameters = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            RestRequest request = new RestRequest(urlSegment);
            request.Method = Method.GET;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Authorization", $"Bearer {token}");

            if (parameters != null && parameters.Count > 0)
            {
                foreach (var item in parameters)
                {
                    request.AddParameter(item.Key, item.Value);
                }
            }

            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                var apiResponse = await _client.ExecuteAsync(request, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
                return apiResponse;
            }
            catch (System.Net.Http.HttpRequestException ex)
            {
                throw ex;
            }
            catch (TaskCanceledException ex)
            {
                throw ex;
            }
        }

        protected async Task<T> GetRequestWithAPIKey<T>(string urlSegment, CancellationToken cancellationToken = default(CancellationToken))
        {
            RestRequest request = new RestRequest(urlSegment);
            request.Method = Method.GET;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("apiKey", _apiKey);

            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                var apiResponse = await _client.ExecuteAsync(request, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();

                if (apiResponse.StatusCode == HttpStatusCode.BadRequest)
                {
                    var apiResponseMassage = JsonConvert.DeserializeObject<ErrorResponse>(apiResponse.Content);
                    throw new WebException(apiResponseMassage.Message);
                }

                var returnObject = JsonConvert.DeserializeObject<T>(apiResponse.Content);
                return returnObject;
            }
            catch (System.Net.Http.HttpRequestException ex)
            {
                throw ex;
            }
            catch (TaskCanceledException ex)
            {
                throw ex;
            }
        }

        protected async Task<IRestResponse> PostRequest(string urlSegment, object requestBody, string token = null, IDictionary<string, object> parameters = null, string contenttype = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            RestRequest request = new RestRequest(urlSegment);
            request.Method = Method.POST;
            request.AddHeader("Accept", "application/json");
            if (!string.IsNullOrEmpty(token))
                request.AddHeader("Authorization", $"Bearer {token}");

            if (requestBody != null)
                request.AddJsonBody(requestBody,"application/json");

            if (parameters != null && parameters.Count > 0)
            {
                foreach (var item in parameters)
                {
                    request.AddParameter(item.Key, item.Value);
                }
            }

            if (!string.IsNullOrEmpty(contenttype))
                request.AddHeader("Content-Type", contenttype);
            else
                request.AddHeader("Content-Type", "application/json");

            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                var apiResponse = await _client.ExecuteAsync(request, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
                return apiResponse;
            }
            catch (TaskCanceledException ex)
            {
                throw ex;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        protected async Task<IRestResponse> PutRequest(string urlSegment, object requestBody, string token = null, IDictionary<string, object> parameters = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            RestRequest request = new RestRequest(urlSegment);
            request.Method = Method.PUT;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json");
            if (!string.IsNullOrEmpty(token))
                request.AddHeader("Authorization", $"Bearer {token}");

            if (requestBody != null)
                request.AddJsonBody(requestBody);

            if (parameters != null && parameters.Count > 0)
            {
                foreach (var item in parameters)
                {
                    request.AddParameter(item.Key, item.Value);
                }
            }

            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                var apiResponse = await _client.ExecuteAsync(request, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
                return apiResponse;
            }
            catch (TaskCanceledException ex)
            {
                throw ex;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        protected async Task<IRestResponse> DeleteRequest(string urlSegment, object requestBody = null, string token = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            RestRequest request = new RestRequest(urlSegment);
            request.Method = Method.DELETE;
            request.AddHeader("Accept", "application/json");
            if (!string.IsNullOrEmpty(token))
                request.AddHeader("Authorization", $"Bearer {token}");

            if (requestBody != null)
                request.AddJsonBody(requestBody);

            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                var apiResponse = await _client.ExecuteAsync(request, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
                return apiResponse;
            }
            catch (TaskCanceledException ex)
            {
                throw ex;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        protected async Task<IRestResponse> MultipartPostRequest(string urlSegment, object requestBody, string token = null, IDictionary<string, object> parameters = null, string contenttype = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            RestRequest request = new RestRequest(urlSegment);
            request.Method = Method.POST;
            request.AddHeader("Accept", "application/json");
            if (!string.IsNullOrEmpty(token))
                request.AddHeader("Authorization", $"Bearer {token}");

            if (requestBody != null)
                request.AddJsonBody(requestBody);

            if (parameters != null && parameters.Count > 0)
            {
                foreach (var items in parameters)
                { 
                    byte[] formItemBytes = System.Text.Encoding.UTF8.GetBytes(string.Format("Content-Disposition: form-data; name=\"{0}\";\r\n\r\n{1}", items.Key, items.Value));
                    request.AddFileBytes(items.Key, formItemBytes,null);
                }
            }

            if (!string.IsNullOrEmpty(contenttype))
                request.AddHeader("Content-Type", contenttype);
            else
                request.AddHeader("Content-Type", "multipart/form-data");

            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                var apiResponse = await _client.ExecuteAsync(request, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
                return apiResponse;
            }
            catch (TaskCanceledException ex)
            {
                throw ex;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
