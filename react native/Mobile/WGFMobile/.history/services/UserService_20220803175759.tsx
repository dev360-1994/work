import { BASE_URL } from "../const";
import { get, getTeamSessionStartData, getTeamUserData, put, UpdateDashboardTeamColor } from "./common/http";



export const getSettingsTeamUser = () => getTeamUserData(`${BASE_URL}/api/Settings/TeamUsers`);

export const getTeamSessionStart = () => getTeamSessionStartData(`${BASE_URL}/api/Settings/TeamStart`);

export const OnGetUpdateTeamColor = (data: any) => UpdateDashboardTeamColor(`${BASE_URL}/api/User/TeamInfo`, data);
