import axios from 'axios';
import account from '../Utility/URIConstants/Account';
import utils from '../Utility/constants';
import Constants from 'expo-constants';
import { AsyncStorage} from 'react-native';
export default class SettingService {
    static async changePassword(currentPassword, newPassword, currentUser, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.CHANGE_PASSWORD}`,
          {
            params: { currentPassword: currentPassword, newPassword: newPassword, currentUser: currentUser },
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
          }).then((response) => { return response }).catch(function (error) { return Promise.reject(error);});
      }
    
      static async updateTenant(TenantId, Latitude, Longitude,userId, token) {
        return await axios.get(`${this.config.apiEndPoint}${account.UPDATE_TENANT}`,
          {
            params: { TenantId: TenantId, Latitude: Latitude, Longitude: Longitude ,userId},
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
          }).then((response) => { return response }).catch(function (error) { return Promise.reject(error);});
      }
    
      static async updateUser( TenantId,  CompanyName,  FirstName,  LastName,EmailAddress,PhoneNumber ,userId,token) {
        return await axios.get(`${this.config.apiEndPoint}${account.UPDATE_MOBILE_USER}`,
          {
            params: {TenantId,  CompanyName,  FirstName,  LastName,  EmailAddress,  PhoneNumber ,userId},
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
          }) .then((response) => { return response }).catch(function (error) { return Promise.reject(error);});
      }
      
      static async getUserDetails( userID,token) {
        return await axios.get(`${this.config.apiEndPoint}${account.GET_USER_DETAILS}`,
          {
            params: {userID},
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
          }) .then((response) => { return response }).catch(function (error) { return Promise.reject(error);});
      }
      static async deletedAccount( userID,token) {
        return await axios.get(`${this.config.apiEndPoint}${account.Delete_Account}`,
          {
            params: {userID:userID},
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
          }) .then((response) => { return response }).catch(function (error) { return Promise.reject(error);});
      }
      static async saveErrorLog(error) {
        const token = await AsyncStorage.getItem("userData")
        return await axios.get(`${this.config.apiEndPoint}${account.Save_Error_Log}`,
          {
            params: {error:error},
            headers: { 'Content-Type': 'application/json', 'Authorization': token }
          }) .then((response) => { return response }).catch(function (error) { return Promise.reject(error);});
      }



    static get config() {
        return Constants.manifest.extra;
    }
}