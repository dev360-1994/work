using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class AddDefaultClip
    {
        [JsonProperty("filmGuid")]
        public string FilmGuid { get; set; }
    }
}
