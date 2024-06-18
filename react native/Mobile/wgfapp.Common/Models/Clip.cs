using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
namespace wgfapp.Common.Models
{
    public class Clip : BaseUserInfo
    {
        [JsonProperty("playlistId")]
        public int PlaylistId { get; set; }

        [JsonProperty("playlistGuid")] 
        public string PlaylistGuid { get; set; }

        [JsonProperty("playlistName")] 
        public string PlaylistName { get; set; }

        [JsonProperty("clipId")] 
        public long ClipId { get; set; }

        [JsonProperty("clipStart")] 
        public decimal ClipStart { get; set; }

        [JsonProperty("clipStop")] 
        public decimal ClipStop { get; set; }

        [JsonProperty("clipEnd")] 
        public DateTime ClipEnd { get; set; }

        [JsonProperty("filmId")] 
        public int FilmId { get; set; }

        [JsonProperty("clipServerName")] 
        public string ClipServerName { get; set; }

        [JsonProperty("clipClientName")] 
        public string ClipClientName { get; set; }

        [JsonProperty("filmGuid")] 
        public string FilmGuid { get; set; }

        [JsonProperty("pcId")] 
        public int PcId { get; set; }

        [JsonProperty("clipOrder")] 
        public int ClipOrder { get; set; }

        [JsonProperty("clipLength")] 
        public int ClipLength { get; set; }

        [JsonProperty("clipTime")] 
        public DateTime ClipTime { get; set; }

        [JsonProperty("clipGuid")] 
        public string ClipGuid { get; set; }

        [JsonProperty("clipsdSize")] 
        public long ClipsdSize { get; set; }

        [JsonProperty("cliphdSize")] 
        public long CliphdSize { get; set; }

        [JsonProperty("teamServer")] 
        public string TeamServer { get; set; }

        [JsonProperty("teamDisk")] 
        public string TeamDisk { get; set; }

        [JsonProperty("teamGuid")] 
        public string TeamGuid { get; set; }

        [JsonProperty("angle1")] 
        public long Angle1 { get; set; }

        [JsonProperty("angleId1")] 
        public int AngleId1 { get; set; }

        [JsonProperty("angle2")] 
        public long Angle2 { get; set; }

        [JsonProperty("angleId2")] 
        public int AngleId2 { get; set; }

        [JsonProperty("angle3")] 
        public long Angle3 { get; set; }

        [JsonProperty("angleId3")] 
        public int AngleId3 { get; set; }

        [JsonProperty("angle4")] 
        public long Angle4 { get; set; }

        [JsonProperty("angleId4")] 
        public int AngleId4 { get; set; }

        [JsonProperty("angle5")] 
        public long Angle5 { get; set; }

        [JsonProperty("angle0")] 
        public int Angle0 { get; set; }

        [JsonProperty("dateCreated")] 
        public DateTime DateCreated { get; set; }

        [JsonProperty("dateUpdated")] 
        public DateTime DateUpdated { get; set; }

        [JsonProperty("clipStatus")] 
        public int ClipStatus { get; set; }

        [JsonProperty("custom1")] 
        public string Custom1 { get; set; }

        [JsonProperty("custom2")] 
        public string Custom2 { get; set; }

        [JsonProperty("custom3")] 
        public string Custom3 { get; set; }

        [JsonProperty("miscGroup")] 
        public string MiscGroup { get; set; }

        [JsonProperty("miscTitle")] 
        public string MiscTitle { get; set; }

        [JsonProperty("miscCategory")] 
        public string MiscCategory { get; set; }

        [JsonProperty("sportPeriod")] 
        public string SportPeriod { get; set; }

        [JsonProperty("sportCategory")] 
        public int SportCategory { get; set; }

        [JsonProperty("sportGroup")] 
        public string SportGroup { get; set; }

        [JsonProperty("sportTitle")] 
        public string SportTitle { get; set; }

        [JsonProperty("sportResult")] 
        public string SportResult { get; set; }

        [JsonProperty("footballQtr")] 
        public int? FootballQtr { get; set; }

        [JsonProperty("footballOdk")] 
        public char? FootballOdk { get; set; }

        [JsonProperty("footballPlayType")] 
        public string FootballPlayType { get; set; }

        [JsonProperty("FootballOffPlay")] 
        public string FootballOffPlay { get; set; }

        [JsonProperty("footballOffForm")] 
        public string FootballOffForm { get; set; }

        [JsonProperty("footballDown")] 
        public int? FootballDown { get; set; }

        [JsonProperty("footballDistance")] 
        public int? FootballDistance { get; set; }

        [JsonProperty("footballGainLoss")] 
        public int? FootballGainLoss { get; set; }

        [JsonProperty("footballResult")] 
        public string FootballResult { get; set; }

        [JsonProperty("footballYardLine")] 
        public int FootballYardLine { get; set; }

        [JsonProperty("volleyballServe")] 
        public string VolleyballServe { get; set; }

        [JsonProperty("volleyballAce")] 
        public string VolleyballAce { get; set; }

        [JsonProperty("volleyballDefense")] 
        public string VolleyballDefense { get; set; }

        [JsonProperty("volleyballSet")] 
        public string VolleyballSet { get; set; }

        [JsonProperty("volleyballAssist")] 
        public string VolleyballAssist { get; set; }

        [JsonProperty("volleyballAttack")] 
        public string VolleyballAttack { get; set; }

        [JsonProperty("volleyballKill")] 
        public string VolleyballKill { get; set; }

        [JsonProperty("volleyballBlock")] 
        public string VolleyballBlock { get; set; }

        [JsonProperty("volleyballError")] 
        public string VolleyballError { get; set; }

        [JsonProperty("volleyballPoint")] 
        public int VolleyballPoint { get; set; }

        [JsonProperty("footballName")] 
        public string FootballName { get; set; }
    }

}

