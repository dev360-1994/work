import { BASE_URL } from "../const";
import { get } from "./common/http";



export const getUserRoles = () => get(`${BASE_URL}/api/Settings/TeamUsers/`, null);