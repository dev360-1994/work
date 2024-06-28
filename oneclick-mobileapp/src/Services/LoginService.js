import axios from 'axios';
import account from '../Utility/URIConstants/Account';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
//import authAxios from './axios/authAxios';
//import axiosInstance from '../axios/axiosInterceptor';
export default class LoginService {
  static async checkUserCredentials(email, password) {
    var deviceName = [Platform.OS, Platform.OS !== 'ios' ? Expo.Constants.deviceName : (Expo.Constants.platform.ios.model).split("(")[0]].join("-")
    var deviceInfo = [deviceName, Expo.Constants.manifest.version].join("_")
    return await axios.get(`${this.config.apiEndPoint}${account.SIGN_IN}`,
      { params: { UserName: email, Password: password, deviceInfo } })
      .then((response) => {
        return response
      })
      .catch(function (error) {
        return Promise.reject(error);
      });
  }

  static async forgetPassWord(email) {
    var deviceName = [Platform.OS, Platform.OS !== 'ios' ? Expo.Constants.deviceName : (Expo.Constants.platform.ios.model).split("(")[0]].join("-")
    var deviceInfo = [deviceName, Expo.Constants.manifest.version].join("_")
    return await axios.get(`${this.config.apiEndPoint}${account.FORGETPASSWORD}`,
      // + "?email=" + email)
      { params: { email: email, deviceInfo } })
      .then((response) => { return response })
      .catch(function (error) {
        return Promise.reject(error);
      });
  }

  static async checkEmailExist(email) {
    return await axios.get(`${this.config.apiEndPoint}${account.CHCEKEMAILEXIST}`, {
      params: {
        emailAddress: email,
        initialEmailAddress: ''
      }
    })
      .then((response) => { return response })
      .catch(function (error) {
        return Promise.reject(error);
      });
  }


  static async sendEmailVerifyLink(userEmail) {
    return await axios.get(`${this.config.apiEndPoint}${account.EmailVerify}`, {
      params: {
        email: userEmail
      }
    })
      .then((response) => { return response })
      .catch(function (error) {
        return Promise.reject(error);
      });
  }

  static async getTermsCondition(keyname) {
    return await axios.get(`${this.config.apiEndPoint}${account.TERMS_CONDITION}`, { params: { key: keyname } })
      .then((response) => { return response })
      .catch(function (error) {
        return Promise.reject(error);
      });
  }

  static async createUserTenant(tenantName, FName, LName, Email, pass) {
    var deviceName = [Platform.OS, Platform.OS !== 'ios' ? Expo.Constants.deviceName : (Expo.Constants.platform.ios.model).split("(")[0]].join("-")
    var deviceInfo = [deviceName, Expo.Constants.manifest.version].join("_")
    return await axios.get(`${this.config.apiEndPoint}${account.Add_USER}`,
      { params: { CompanyName: tenantName, FirstName: FName, LastName: LName, EmailAddress: Email, password: pass, deviceInfo } })
      .then((response) => { return response })
      .catch(function (error) {
        return Promise.reject(error);
      });
  }

  static async userDashBoard(token) {
    return await axios.get(`${this.config.apiEndPoint}${account.USER_DASHBOARD}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': token }
    })
      .then((response) => { return response })
      .catch(function (error) {
        return Promise.reject(error);
      });
  }

  static async termsCondition(keyname) {
    return await axios.get(`${this.config.apiEndPoint}${account.MOBILE_SETTINGS}`,
      { params: { key: keyname } })
      .then((response) => { return response })
      .catch(function (error) {
        return Promise.reject(error);
      });
  }




  static get config() {
    return Constants.manifest.extra;
  }

}