import { BASE_URL } from "../const";
import { get, getTeamUserData } from "./common/http";



export const getSettingsTeamUser = () => getTeamUserData(`${BASE_URL}/api/Settings/TeamUsers`);