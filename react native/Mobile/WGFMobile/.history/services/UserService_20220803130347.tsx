import { BASE_URL } from "../const";
import { get, getTeamUserData } from "./common/http";



export const getSettingsTeamUser = (userId: any, teamId: any) => getTeamUserData(`${BASE_URL}/api/Settings/TeamUsers/${userId}/${teamId}`);