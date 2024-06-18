import { BASE_URL } from "../const";
import { get } from "./common/http";



export const getUserRoles = (userId: any, teamId: any) => get(`${BASE_URL}/api/Settings/TeamUsers/${userId}/${teamId}`, null);