using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class ResendInvite 
    {
        public string emailAddress { get; set; }

        public int teamId { get; set; }

        public int userId { get; set; }
    }
}
