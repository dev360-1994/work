using System;
using System.Net;

namespace wgfapp.Common.Models
{
    public class ApiBaseResponse<T>
    {
        public HttpStatusCode Status { get; set; }

        public string Message { get; set; }

        public T Data { get; set; }
    }
}
