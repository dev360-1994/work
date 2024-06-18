import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { CLIENT_ID, CLIENT_SECRET } from "../../const";
import { doAuthenticate } from "../AuthenticationService";
import { AuthenticationModelResponse } from "../Model/AuthenticationModel";
import { SessionInfoModel } from "../Model/SessionInfoModel";

const SESSION_NAME = "W1G0F0_Session";


function isTokenExpired(token: string, tokenExpiryTime: string) {
  if (token == "" && tokenExpiryTime == "") {
    return true;
  }
  else {
    let expiryTime: Date = new Date(tokenExpiryTime);
    let nowDate: Date = new Date(new Date().toISOString());
    let pendingSeconds: number = (+expiryTime - +nowDate) / 1000;

    //console.log("http middleware seconds - ", pendingSeconds);

    if (pendingSeconds < 300) {
      return true;
    }
    else {
      return false;
    }
  }

}


async function refreshAuthToken(sessionInfo: SessionInfoModel) {
  try {

    var resultPromise = await doAuthenticate({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    });
    console.log(resultPromise);

    let response: AuthenticationModelResponse = JSON.parse(JSON.stringify(resultPromise));

    // prepare expiry time
    let nowDate = new Date().toISOString();
    let expiryTime = new Date();
    expiryTime.setSeconds(new Date(nowDate).getSeconds() + response.expires_In);
    //expiryTime.setSeconds(new Date(nowDate).getSeconds() + 300);

    sessionInfo.token = response.access_Token;
    sessionInfo.tokenExpiryTime = expiryTime.toISOString();

    return sessionInfo;

  } catch (error) {
    if (error) {
      console.log(error);
    }
    return null;
  }
}

async function getVerifiedSessionInfo(sessionInfo: SessionInfoModel) {
  //console.log('Loading sessionInfo from storage');
  if (!sessionInfo) {
    //console.log('token created');
    sessionInfo = new SessionInfoModel();
    const response = await refreshAuthToken(sessionInfo);

    await setSession(response);

    return response;
  }
  else if (sessionInfo) {
    //console.log('checking token');

    if (!isTokenExpired(sessionInfo.token, sessionInfo.tokenExpiryTime)) {
      //console.log('returning token');

      return sessionInfo;
    } else {
      //console.log('token expired');

      //console.log('fetching token using refresh');

      const response = await refreshAuthToken(sessionInfo);

      await setSession(response);

      //console.log('UPDATED ONE')

      return response;

    }
  } else {
    //console.log('token not available please login')

    return null;
  }
}



async function storeDataForIOS(credentials: SessionInfoModel) {
  if (!(credentials && credentials.token)) {
    credentials = new SessionInfoModel();
  }
  try {
    await SecureStore.setItemAsync(SESSION_NAME, JSON.stringify(credentials));
  } catch (error) {
    // Error saving data
  }
}

const readDataForIOS = async () => {
  try {
    let credentials = await SecureStore.getItemAsync(SESSION_NAME)
    // console.log("credentials:", credentials);
    let sessionInfo: SessionInfoModel = (credentials) ? JSON.parse(credentials) : null;

    let cred = await getVerifiedSessionInfo(sessionInfo)

    if (credentials != null && cred != null) {
      return cred
    } else {
      return null
    }
  } catch (e) {
    console.log(e)
  }

  return null
}


export const getSession = () => {
  function inner() {
    return readDataForIOS().then(response => { return response; }).catch(error => { return error; });
  }
  return inner();

}

export function setSession(credentials: any) {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return storeDataForIOS(credentials);
  }
  return null;
}


// final working
////==================
// const readDataForIOS = () => {

//   function inner() {
//     return SecureStore.getItemAsync(SESSION_NAME)
//       .then(sessionData => {
//         let sessionInfo: SessionInfoModel = (sessionData) ? JSON.parse(sessionData) : null;
//         return sessionInfo;
//       })
//       .catch(error => {
//         return null;
//       });
//   }
//   return inner();
// }
////==================

