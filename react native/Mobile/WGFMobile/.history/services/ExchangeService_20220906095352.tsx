import { BASE_URL } from "../const";
import { get, post } from "./common/http";

export const exchangeInboxGridData = (teamId: any) => get(`${BASE_URL}/api/Exchange/ExchangeInbox/` + teamId, null);

export const exchangeGridData = (teamId: any) => get(`${BASE_URL}/api/Exchange/ExchangePlaylist/` + teamId, null);

export const exchangeGridLockerOutData = (teamId: any) => get(`${BASE_URL}/api/Exchange/LockerOut/` + teamId, null);

export const exchangeHistoryGridData = (teamId: any) => get(`${BASE_URL}/api/Exchange/ExchangeHistory/` + teamId, null);

export const getLockerInTeams = (teamId: any) => get(`${BASE_URL}/api/Exchange/LockerInLeagueTeams/` + teamId, null);

export const exchangeLeaguePostData = (playlistGuid: any) => get(`${BASE_URL}/api/Exchange/ExchangeLeaguePlaylist/` + playlistGuid, null);

export const insertLockIn = (data: any) => post(`${BASE_URL}/api/Exchange/LockerIn`, data);

export const insertLockOut = (data: any) => post(`${BASE_URL}/api/Exchange/LockerOut`, data);

export const leagueTeam = (teamId: any) => get(`${BASE_URL}/api/Exchange/LeagueTeams/` + teamId, null);

export const insertLeagueExchange = (data: any) => post(`${BASE_URL}/api/Exchange/ExchangeLeague`, data);

export const getTeamByEmailAddress = (email: any) => get(`${BASE_URL}/api/Exchange/ExchangeTeams/` + email, null);

export const sendFilmExchange = (data: any) => post(`${BASE_URL}/api/Exchange/SendExchangeFilm`, data);

export const insertExchangeInbox = (data: any) => post(`${BASE_URL}/api/Exchange/ExchangePost`, data);



