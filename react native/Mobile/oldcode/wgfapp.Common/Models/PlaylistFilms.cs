using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class PlaylistFilms
    {
        [JsonProperty("playlistid")]
        public int PlayListId { get; set; }

        [JsonProperty("playlistguid")]
        public string PlayListGuid { get; set; }

        [JsonProperty("playlistname")]
        public string PlayListName { get; set; }

        [JsonProperty("teamid")]
        public int TeamId { get; set; }

        [JsonProperty("clipid")]
        public int ClipId { get; set; }

        [JsonProperty("filmid")]
        public int FilmId { get; set; }

        [JsonProperty("cliporder")]
        public int ClipOrder { get; set; }

        [JsonProperty("cliplength")]
        public int ClipLength { get; set; }

        [JsonProperty("cliptime")]
        public string ClipTime { get; set; }

        [JsonProperty("clipguid")]
        public string ClipGuid { get; set; }

        [JsonProperty("clipsdsize")]
        public int ClipSDSize { get; set; }

        [JsonProperty("cliphdsize")]
        public int ClipHDSize { get; set; }

        [JsonProperty("teamserver")]
        public string TeamServer { get; set; }

        [JsonProperty("teamdisk")]
        public string TeamDisk { get; set; }

        [JsonProperty("teamguid")]
        public string TeamGuid { get; set; }

        [JsonProperty("sport_period")]
        public int SportPeriod { get; set; }

        [JsonProperty("sport_category")]
        public string SportCategory { get; set; }

        [JsonProperty("sport_title")]
        public string SportTitle { get; set; }

        [JsonProperty("sport_result")]
        public string SportResult { get; set; }

        [JsonProperty("sport_group")]
        public string SportGroup { get; set; }

        [JsonProperty("angle1")]
        public int Angle1 { get; set; }

        [JsonProperty("angle2")]
        public int Angle2 { get; set; }

        [JsonProperty("angle3")]
        public int Angle3 { get; set; }

        [JsonProperty("angle4")]
        public int Angle4 { get; set; }

        [JsonProperty("angle0")]
        public int Angle0 { get; set; }

        [JsonProperty("misc_title")]
        public string MiscTitle { get; set; }

        [JsonProperty("misc_group")]
        public string MiscGroup { get; set; }

        [JsonProperty("misc_category")]
        public string MiscCategory { get; set; }

        [JsonProperty("football_qtr")]
        public int FootballQtr { get; set; }

        [JsonProperty("football_odk")]
        public object FootballOdk { get; set; }

        [JsonProperty("football_down")]
        public int FootballDown { get; set; }

        [JsonProperty("football_distance")]
        public int FootballDistance { get; set; }

        [JsonProperty("football_hash")]
        public string FootballHash { get; set; }

        [JsonProperty("football_yard_line")]
        public int FootballYardLine { get; set; }

        [JsonProperty("football_play_type")]
        public string FootballPlayType { get; set; }

        [JsonProperty("football_result")]
        public string FootballResult { get; set; }

        [JsonProperty("football_gain_loss")]
        public int FootballGainLoss { get; set; }

        [JsonProperty("football_off_form")]
        public string FootballOffForm { get; set; }

        [JsonProperty("football_off_play")]
        public string FootballOffPlay { get; set; }

        [JsonProperty("football_off_strength")]
        public object FootballOffStrength { get; set; }

        [JsonProperty("football_play_direction")]
        public object FootballPlayDirection { get; set; }

        [JsonProperty("football_gap")]
        public object FootballGap { get; set; }

        [JsonProperty("football_pass_zone")]
        public string FootballPassZone { get; set; }

        [JsonProperty("football_def_front")]
        public string FootballDefFront { get; set; }

        [JsonProperty("football_coverage")]
        public string FootballCoverage { get; set; }

        [JsonProperty("football_blitz")]
        public string FootballBlitz { get; set; }

        [JsonProperty("football_2_min")]
        public string Football2Min { get; set; }

        [JsonProperty("football_backfield")]
        public int FootballBackfield { get; set; }

        [JsonProperty("football_def_strength")]
        public object FootballDefStrength { get; set; }

        [JsonProperty("football_int_by")]
        public int FootballIntBy { get; set; }

        [JsonProperty("football_eff")]
        public string FootballEff { get; set; }

        [JsonProperty("football_key_player")]
        public int FootballKeyPlayer { get; set; }

        [JsonProperty("football_kicker")]
        public int FootballKicker { get; set; }

        [JsonProperty("football_kick_yards")]
        public int FootballKickYards { get; set; }

        [JsonProperty("football_motion")]
        public string FootballMotion { get; set; }

        [JsonProperty("football_motion_dir")]
        public object FootballMotionDir { get; set; }

        [JsonProperty("football_opp_int")]
        public int FootballOppInt { get; set; }

        [JsonProperty("football_opp_kicker")]
        public int FootballOppKicker { get; set; }

        [JsonProperty("football_opp_passer")]
        public int FootballOppPasser { get; set; }

        [JsonProperty("football_opp_receiver")]
        public int FootballOppReceiver { get; set; }

        [JsonProperty("football_opp_recover")]
        public int FootballOppRecover { get; set; }

        [JsonProperty("football_opp_rusher")]
        public int FootballOppRusher { get; set; }

        [JsonProperty("football_opp_returner")]
        public int FootballOppReturner { get; set; }

        [JsonProperty("football_opp_tackler1")]
        public int FootballOppTackler1 { get; set; }

        [JsonProperty("football_opp_tackler2")]
        public string FootballOppTackler2 { get; set; }

        [JsonProperty("football_opp_team")]
        public string FootballOppTeam { get; set; }

        [JsonProperty("football_passer")]
        public int FootballPasser { get; set; }

        [JsonProperty("football_pen_yards")]
        public int FootballPenYards { get; set; }

        [JsonProperty("football_penalty")]
        public string FootballPenalty { get; set; }

        [JsonProperty("football_personnel")]
        public string FootballPersonnel { get; set; }

        [JsonProperty("football_receiver")]
        public int FootballReceiver { get; set; }

        [JsonProperty("football_recover")]
        public int FootballRecover { get; set; }

        [JsonProperty("football_return_yards")]
        public int FootballReturnYards { get; set; }

        [JsonProperty("football_returner")]
        public int FootballReturner { get; set; }

        [JsonProperty("football_rusher")]
        public int FootballRusher { get; set; }

        [JsonProperty("football_series")]
        public int FootballSeries { get; set; }

        [JsonProperty("football_tackler1")]
        public int FootballTackler1 { get; set; }

        [JsonProperty("football_tackler2")]
        public int FootballTackler2 { get; set; }

        [JsonProperty("football_team")]
        public string FootballTeam { get; set; }

        [JsonProperty("football_title")]
        public string FootballTitle { get; set; }

        [JsonProperty("datecreated")]
        public DateTime DateCreated { get; set; }

        [JsonProperty("dateupdated")]
        public string DateUpdated { get; set; }
    }
}
