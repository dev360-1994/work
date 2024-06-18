import { post, get, getUserProfileData } from "./common/http";
import { BASE_URL } from "../const";


export const getProfileData = async () => {
    return getUserProfileData(`${BASE_URL}/api/User/GetUserProfile`);
}
