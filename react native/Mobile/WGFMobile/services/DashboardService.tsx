import {  get } from "./common/http";
import { BASE_URL } from "../const";

export const getUserRoles = () => get(`${BASE_URL}/api/User/GetUserRoles`, null);

export const getUserTeams = (params: any) => get(`${BASE_URL}/api/User/GetUserTeams/` + params, null);

export const getTeamInfo = (params: any) => get(`${BASE_URL}/api/User/TeamInfo/` + params, null);

export const getDashboardAlerts = (params: any) => get(`${BASE_URL}/api/User/status/` + params, null);

export const getSwitchUserTeams = (params: any) => get(`${BASE_URL}/api/TeamUsers/SwitchTeam/` + params, null);

