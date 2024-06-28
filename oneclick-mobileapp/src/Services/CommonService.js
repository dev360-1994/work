import { showMessage } from "react-native-flash-message";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import message from '../Utility/Message';
import moment from 'moment';
import { BackHandler } from 'react-native';
import {Alert} from 'react-native';
import {SettingService } from '../Services';
import NetInfo from "@react-native-community/netinfo";
export default class CommonService {

  static async appPermissions() {
    const camerapPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA ,Permissions.LOCATION);
    if (camerapPermission.status !== 'granted') {
      const newcamerapPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA ,Permissions.LOCATION);
      return newcamerapPermission.status
    }
    return camerapPermission.status;
  }
  static async getLocation(){
    const location = await Location.getCurrentPositionAsync({});
    if(location){
      return location
    }
      return location
  }

  static showErrorNotification(message) {
    showMessage({
      message: message,
      type: 'danger',
      duration: 3000
    });
    NetInfo.fetch().then(state => {
      state.isConnected == true &&
        SettingService.saveErrorLog(message).then((response) => { }).catch((error) => {  });
    });

  }

  static showWarningNotification(message) {
    showMessage({
      message: message,
      type: 'warning',
      duration: 3000,
    });
  }

  static showSuccessNotification(message) {
    showMessage({
      message: message,
      type: 'success',
      duration: 2000,
    });
  }

  static handleError = (response) => {
    const data = response["data"];
    if (data["Success"] == false) {
      CommonService.showErrorNotification(data["Message"]);
    } else {
      CommonService.showErrorNotification(message.internal_error);
    }
  }

  static getCurrentDateAndTime() {
    const today = new Date();
    const date = moment(today, 'DD/MMM/YYYY').format("DD-MMM-YYYY");
    const minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    return { date, time };
  }


  static handleAndroidBackButton = callback => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      callback();
      return true;
    });
  };
  
  static removeAndroidBackButtonHandler = () => {
    BackHandler.removeEventListener('hardwareBackPress', () => { });
  }  
}
