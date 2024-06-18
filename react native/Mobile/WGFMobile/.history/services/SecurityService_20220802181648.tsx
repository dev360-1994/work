import { BASE_URL } from "../const"
import { get } from "./common/http"


export const getSecurityData = async (teamId: any) => {
    return await get(`${BASE_URL}/api/Settings/Security/${teamId}`, "")
} 