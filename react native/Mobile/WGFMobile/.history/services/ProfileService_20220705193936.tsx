import { post, get, getUserProfileData, onPutResetPassword, OnPutSubmitUserDetails } from "./common/http";
import { BASE_URL } from "../const";


export const getProfileData = async () => {
    return getUserProfileData(`${BASE_URL}/api/User/GetUserProfile`);
}

//api/User/UpdatePassword

export const onResetPassword = async (data: any) => {
    return onPutResetPassword(`${BASE_URL}/api/User/UpdatePassword`, data);
}



export const SaveUserSettings = async (data: any) => {
    return OnPutSubmitUserDetails(`${BASE_URL}/api/User/UpdateUserProfile`, data);
}


