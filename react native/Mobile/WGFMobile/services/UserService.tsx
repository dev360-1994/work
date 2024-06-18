import axios from "axios";
import { BASE_URL } from "../const";
import { get, getHistoryData, deleteAsync, getTeamSessionStartData, getTeamUserData, post, put, UpdateDashboardTeamColor } from "./common/http";
import { getSession } from "./common/Session";

export const getTeamInfo = (teamId: any, userId: any) => get(`${BASE_URL}/api/User/TeamInfo/${teamId}/${userId}`, null);

export const getSettingsTeamUser = () => getTeamUserData(`${BASE_URL}/api/Settings/TeamUsers`);

export const getTeamSessionStart = () => getTeamSessionStartData(`${BASE_URL}/api/Settings/TeamStart`);

export const OnGetUpdateTeamColor = (data: any) => UpdateDashboardTeamColor(`${BASE_URL}/api/User/TeamInfo`, data);

export const OnPutTeamSessionAsync = (data: any) => UpdateDashboardTeamColor(`${BASE_URL}/api/Settings/TeamStart`, data);

export const OnGetHistoryDataAsync = () => getHistoryData(`${BASE_URL}/api/User/History`);

export const GetTeamUsers = (params: string) => get(`${BASE_URL}/api/Settings/TeamUsers/${params}`, null);

export const SaveTeamUsers = async (data: any) => {
    await getSession().then(async function (value) {
        data["TeamId"] = value.userInfo?.teamId.toString() ?? "0";
        data["AddUserId"] = value.userInfo?.userId.toString() ?? "0";
        console.log(data);
        const response = await post(`${BASE_URL}/api/Settings/TeamUser`, data);
        return response;
    });
}

export const UpdateTeamUsers = async (data: any) => {
    await getSession().then(async function (value) {
        data["TeamId"] = value.userInfo?.teamId.toString() ?? "0";
        data["AddUserId"] = value.userInfo?.userId.toString() ?? "0";
        const response = await put(`${BASE_URL}/api/Settings/TeamUser`, data);
        return response;
    });
}

export const DeleteTeamUsers = async (userId: any) => {
    await getSession().then(async function (value) {
        const teamId = value.userInfo?.teamId.toString() ?? "0";
        const addUserId = value.userInfo?.userId.toString() ?? "0";
        console.log(teamId, userId, addUserId);
        const response = await deleteAsync(`${BASE_URL}/api/Settings/TeamUser/${teamId}/${userId}/${addUserId}`);
        return response;
    });
}

export const InviteTeamUsers = async (data: any) => {
    await getSession().then(async function (value) {
        data["TeamId"] = value.userInfo?.teamId.toString() ?? "0";
        console.log(data);
        const response = await post(`${BASE_URL}/api/Settings/ResendInvite`, data);
        return response;
    });
}
