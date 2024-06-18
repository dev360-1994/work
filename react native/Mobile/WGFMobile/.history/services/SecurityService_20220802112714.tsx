import { BASE_URL } from "../const"
import { get } from "./common/http"


export const getSecurityData = (teamId: any) => {
    return get(`${BASE_URL}/api/Settings/Security/${teamId}`, "")
} 