using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class PlaylistClips : BaseUserInfo
    {
        [JsonProperty("playlistId")]
        public int PlaylistId { get; set; }

        [JsonProperty("playListView")]
        public int PlayListView { get; set; }

        [JsonProperty("playlistGuid")]
        public string PlayListGuid { get; set; }

        [JsonProperty("playListName")]
        public string PlayListName { get; set; }

        [JsonProperty("clipId")]
        public int ClipId { get; set; }

        [JsonProperty("clipStart")]
        public double ClipStart { get; set; }

        [JsonProperty("clipStop")]
        public double ClipStop { get; set; }

        [JsonProperty("clipEnd")]
        public DateTime ClipEnd { get; set; }

        [JsonProperty("filmId")]
        public int FilmId { get; set; }

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
        public int ClipSDSize { get; set; }

        [JsonProperty("cliphdSize")]
        public int CliphdSize { get; set; }

        [JsonProperty("teamServer")]
        public string TeamServer { get; set; }

        [JsonProperty("teamDisk")]
        public string TeamDisk { get; set; }

        [JsonProperty("teamGuid")]
        public string TeamGuid { get; set; }

        [JsonProperty("angle1")]
        public int Angle1 { get; set; }

        [JsonProperty("angleId1")]
        public int AngleId1 { get; set; }

        [JsonProperty("angle2")]
        public int Angle2 { get; set; }

        [JsonProperty("angleId2")]
        public int AngleId2 { get; set; }

        [JsonProperty("angle3")]
        public int Angle3 { get; set; }

        [JsonProperty("angleId3")]
        public int AngleId3 { get; set; }

        [JsonProperty("angle4")]
        public int Angle4 { get; set; }

        [JsonProperty("angleId4")]
        public int AngleId4 { get; set; }

        [JsonProperty("angle5")]
        public int Angle5 { get; set; }

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
        public object SportPeriod { get; set; }

        [JsonProperty("sportCategory")]
        public int SportCategory { get; set; }

        [JsonProperty("sportGroup")]
        public object SportGroup { get; set; }

        [JsonProperty("sportTitle")]
        public object SportTitle { get; set; }

        [JsonProperty("sportResult")]
        public object SportResult { get; set; }

        [JsonProperty("footballQtr")]
        public object FootballQtr { get; set; }

        [JsonProperty("footballName")]
        public object FootballName { get; set; }

        [JsonProperty("footballOdk")]
        public object FootballOdk { get; set; }

        [JsonProperty("footballPlayType")]
        public object FootballPlayType { get; set; }

        [JsonProperty("footballOffPlay")]
        public object FootballOffPlay { get; set; }

        [JsonProperty("footballOffForm")]
        public object FootballOffForm { get; set; }

        [JsonProperty("footballDown")]
        public object FootballDown { get; set; }

        [JsonProperty("footballDistance")]
        public object FootballDistance { get; set; }

        [JsonProperty("footballGainLoss")]
        public object FootballGainLoss { get; set; }

        [JsonProperty("footballResult")]
        public object FootballResult { get; set; }

        [JsonProperty("footballYardLine")]
        public int FootballYardLine { get; set; }

        [JsonProperty("volleyballServe")]
        public object VolleyballServe { get; set; }

        [JsonProperty("volleyballAce")]
        public object VolleyballAce { get; set; }

        [JsonProperty("volleyballDefense")]
        public object VolleyballDefense { get; set; }

        [JsonProperty("volleyballSet")]
        public object VolleyballSet { get; set; }

        [JsonProperty("volleyballAssist")]
        public object VolleyballAssist { get; set; }

        [JsonProperty("volleyballAttack")]
        public object VolleyballAttack { get; set; }

        [JsonProperty("volleyballKill")]
        public object VolleyballKill { get; set; }

        [JsonProperty("volleyballBlock")]
        public object VolleyballBlock { get; set; }

        [JsonProperty("volleyballError")]
        public object VolleyballError { get; set; }

        [JsonProperty("volleyballPoint")]
        public int VolleyballPoint { get; set; }
    }
}
