export class ExchangeModel {
    playlistid: number = 0;
    playlistguid: string = "";
    playlistdate?: Date = undefined;
    playlisttags: string = "";
    playlistname: string = "";
    playlistgroup: string = "";

}

export class LockerOutGetModel {
    filmid: number = 0;
    filmguid: string = "";
    leagueid: number = 0;
    teamid1: number = 0;
    teamid2: number = 0;
    teams: string = "";
    filmtitle: string = "";
    filmdate?: Date = undefined;
    filmpublisher: string = "";
    filmcomments: string = "";
    filmadded?: Date = undefined;
    filmlength: string = "";
    clips: number = 0;
}

export class ExchangeInbox {
    filmid: number = 0;
    teamid: number = 0;
    filmdate?: Date = undefined;
    filmguid: string = "";
    title: string = "";
    group: string = "";
    name: string = "";
}

export class ExchangeHistory {
    exchangeId: number = 0;
    eventId: number = 0;
    filmId: number = 0;
    oldteamId: number = 0;
    newTeamId: number = 0;
    filmTitle: string = "";
    filmDate?: Date = undefined;
    sendTeam: string = "";
    receiveTeam: string = "";
    sender: string = "";
}

export class ExchangeLeague {
    playlistid: number = 0;
    playlistname: string = "";
    playlisttags: string = "";
    playlistdate?: Date = undefined;
    clips: number = 0;
    status: number = 0;
}

export class LockerIn {

    playlistGuid: string = "";
    playlistDate?: Date = undefined;
    playlistName: string = "";
    homeTeamId: number = 0;
    awayTeamId: number = 0;
    teamId: number = 0;
    userId: number = 0;

}

export class LockerOut {
    filmGuid: string = "";
    teamId: number = 0;
    userId: number = 0;
    filmTags: string = "";
    group: string = "";
    title: string = "";
    filmDate?: Date = undefined;
    view: number = 0;
}

export class ExchangeLeagueInsert {
    PlaylistGuid: string = "";
    playlistName: string = ""
    oldteamId: number = 0;
    newTeamId: number = 0;
    filmDate?: Date = undefined;
    userId: number = 0;
}

export class ExchangeTeam {
    teamid: number = 0;
    teamname: string = "";
    leagueId: number = 0;
    teamserver: string = "";
}

export class OpenExchange {
    playlistId: number = 0;
    playlistGuid: string = "";
    teamId: number = 0;
    userId: number = 0;
    recipientEmail: string = "";
    recipientName: string = "";
    filmTitle: string = "";
    addedNotes: string = "";
}

export class LeagueTeamEmailResource {
    senderFirstName: string = "";
    senderLastName: string = "";
    senderEmailAddress: string = "";
    teamEmailAddresses: [] = [];
    teamName: string = "";
    mailBody: string = "";
}