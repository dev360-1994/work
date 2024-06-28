import axios from 'axios';
import account from '../Utility/URIConstants/Account';
import Constants from 'expo-constants';
export default class DashBoardService {
  static async getDashBoardData(token) {
    return await axios.get(`${this.config.apiEndPoint}${account.GET_DASHBOARD_DATA}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': token }
    })
      .then((response) => { return response })
      .catch(function (error) {
        return Promise.reject(error);
      });
  }
  static get config() {
    return Constants.manifest.extra;
  }

}