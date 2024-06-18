import { BASE_URL } from "../const"
import { get, put } from "./common/http"
import { TeamUserSecurity } from "./Model/TeamUserSecurity";


export const getAllSecurityData = (teamId: any) => get(`${BASE_URL}/api/Settings/Security/${teamId}`, "");

export const getSecurityData = (teamId: any, userId: any) =>
    get(`${BASE_URL}/api/Settings/TeamUserSecurity/${teamId}/${userId}`, "");


export const teamUserLayoutAction = async (teamId: any, userId: any, teamAction: string) => {
    let userSettings: TeamUserSecurity[] = await getSecurityData(teamId, userId);
    userSettings = userSettings.filter(x => x.action === teamAction);
    return userSettings[0];
}

export const updateTeamSecurity = (data: any) => put(`${BASE_URL}/api/Settings/Security`, data);

export const resetTeamSecurity = (teamId: any, userId: any) => get(`${BASE_URL}/api/Settings/ResetSecurity/${teamId}/${userId}`, "");



