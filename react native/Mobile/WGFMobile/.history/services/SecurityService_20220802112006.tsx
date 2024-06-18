import { BASE_URL } from "../const"
import { get, getUserSecurityData } from "./common/http"


export const getSecurityData = (teamId: any) => {
    return getUserSecurityData(`${BASE_URL}/api/Settings/Security/`, teamId)
} 