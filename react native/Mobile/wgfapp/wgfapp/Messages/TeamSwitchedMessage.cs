using System;
using wgfapp.Interfaces;

namespace wgfapp.Messages
{
    public class TeamSwitchedMessage : IMessage
    {
        public int TeamId { get; private set; }

        public Guid TeamGuild { get; private set; }

        public string TeamName { get; private set; }

        public TeamSwitchedMessage(int teamId, Guid teamGuid, string teamName)
        {
            TeamId = teamId;
            TeamGuild = teamGuid;
            TeamName = teamName;
        }
    }
}
