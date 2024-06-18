import { BASE_URL } from "../const"
import { get } from "./common/http"


export const getSecurityData = (teamId: number) => {
    return get(`${BASE_URL}/api/Settings/Security/`, teamId)
} 