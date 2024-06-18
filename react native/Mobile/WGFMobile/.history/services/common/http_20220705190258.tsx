import { getSession } from "./Session";
import axios from 'axios';


let token = "";

export const post = (url: string, data = {}, fileToken = "", forToken = false) =>

  new Promise((resolve, reject) => {

    if (forToken == false) {
      getSession().then(function (value) {
        token = value && (value.token ? value.token : "");
      });
    }
    else {
      token = "";
    }

    let options = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    let postOptions = { ...options.headers };

    if (fileToken.length > 0) {
      postOptions = {
        ...options.headers,
        Authorization: fileToken ? `Bearer ${fileToken}` : "",
      };
    }

    return (
      fetch(url, {
        method: "POST",
        headers: postOptions,
        body: JSON.stringify(data),
      })
        .then((response) =>
          // {
          //   console.log(JSON.stringify(response));
          //   if (!(response.ok && response.status === 200)) {
          //     throw new Error(`${response.status}`);
          //   }
          //   return response.text();
          // }
          response.json().then((body) => (
            {
              ok: response.ok,
              status: response.status,
              statusText: response.statusText,
              data: body,
            }))
        )
        .then((responseJson) => {
          //resolve(JSON.parse(responseJson));
          if (!responseJson.ok) {
            if (responseJson.status === 400) {
              //400 = bad request
              if (responseJson.data && responseJson.data.message)
                throw responseJson.data.message;
              else throw responseJson.statusText;
            } else throw responseJson.statusText;
          } else resolve(responseJson.data);
        })
        .catch((error) => {
          reject(error);
        })
    );
  });


export const get = (url: string, params: any) =>
  new Promise((resolve, reject) => {
    getSession()
      .then(function (value) {

        return value;
      })
      .then((value) => {
        token = value && (value.token ? value.token : "");

        let options = {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          observe: 'response'
        };

        return fetch(url, { method: "GET", ...options })
          .then((response) => {

            if (!(response.ok && response.status === 200)) {
              throw new Error(`${response.status}`);
            }
            return response.text();

            // return {
            //   ok: response.ok,
            //   status: response.status,
            //   statusText: ((response.statusText == "") ? response.text() : response.statusText),
            //   data: JSON.parse(response.text())
            // }
            // if (response.ok) {
            //   response.json().then((body) => ({
            //     ok: response.ok,
            //     status: response.status,
            //     statusText: response.statusText,
            //     data: response.text(),
            //   }))
            // }
            // else {
            //   console.log("RESS", response);
            //   return {
            //     ok: response.ok,
            //     status: response.status,
            //     statusText: ((response.statusText == "") ? "Unauthorized Access" : response.statusText),
            //     data: null,
            //   };
            // }
          })
          .then((responseJson) => {

            resolve(JSON.parse(responseJson));
            // console.log("op", responseJson);
            // if (responseJson) {
            //   if (!responseJson.ok) {
            //     throw responseJson.statusText;
            //   }
            //   else
            //     resolve(responseJson.data);
            // }
          })
          .catch((error) => {
            reject(error);
          });
      });

  });


export const put = (url: string, data = {}, fileToken = "") =>
  new Promise((resolve, reject) => {
    getSession().then(function (value) {
      token = value && (value.token ? value.token : "");
    });

    let options = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    let putOptions = { ...options.headers };

    if (fileToken.length > 0) {
      putOptions = {
        ...options.headers,
        Authorization: fileToken ? `Bearer ${fileToken}` : "",
      };
    }

    return (
      fetch(url, {
        method: "PUT",
        headers: putOptions,
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!(response.ok && response.status === 200)) {
            throw new Error(`${response.status}`);
          }
          return response.text();
        }
          // response.json().then((body) => (
          //   {
          //     ok: response.ok,
          //     status: response.status,
          //     statusText: response.statusText,
          //     data: body,
          //   }))
        )
        .then((responseJson) => {
          resolve(JSON.parse(responseJson));
          // if (!responseJson.ok) {
          //   if (responseJson.status === 400) {
          //     //400 = bad request
          //     if (responseJson.data && responseJson.data.message)
          //       throw responseJson.data.message;
          //     else throw responseJson.statusText;
          //   } else throw responseJson.statusText;
          // } else resolve(responseJson.data);
        })
        .catch((error) => {
          reject(error);
        })
    );
  });

//video post method

export const videoPost = async (url: string, data = {}, videoId: string, extension: string) => {
  let responseData;
  await axios({
    url: url,
    method: 'POST',
    data: {
      Data: data,
      VideoName: videoId,
      Extension: extension
    }
  })
    .then(function (response) {
      // console.log('*****handle success******');
      // console.log(response.status);
      responseData = response.status;

    })
    .catch(function (response) {
      // console.log('*****handle failure******');
      // console.log(response);
      responseData = response.status;
    });
  return responseData;
}

//"https://slot1.watchgamefilm.com/api/User/GetUserProfile/5277/134901"

export const getUserProfileData = async (url: string) => new Promise((resolve, reject) => {
  // console.log(url);
  getSession()
    .then(function (value) {
      return value;
    })
    .then(async (value) => {
      token = value && (value.token ? value.token : "");
      url = url +
        `/${value.userInfo?.teamId.toString() ?? "0"}/${value.userInfo?.userId.toString() ?? "0"}`;
      // console.log(url);
      let options = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        observe: 'response'
      };

      try {
        const response = await fetch(url, { method: "GET", ...options });
        if (!(response.ok && response.status === 200)) {
          throw new Error(`${response.status}`);
        }
        const responseJson = await response.text();
        resolve(JSON.parse(responseJson));
      } catch (error) {
        reject(error);
      }
    });

});

//https://slot1.watchgamefilm.com/api/User/UpdatePassword

export const onPutResetPassword = (url: string, data = {}, fileToken = "") =>
  new Promise((resolve, reject) => {
    getSession().then(function (value) {
      token = value && (value.token ? value.token : "");
      data.TeamId = value.userInfo?.teamId.toString() ?? "0";
      data.UserId = value.userInfo?.userId.toString() ?? "0";
    });

    let options = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    let putOptions = { ...options.headers };

    if (fileToken.length > 0) {
      putOptions = {
        ...options.headers,
        Authorization: fileToken ? `Bearer ${fileToken}` : "",
      };
    }
    console.log(data);
    // return (
    //   fetch(url, {
    //     method: "PUT",
    //     headers: putOptions,
    //     body: JSON.stringify(data),
    //   })
    //     .then((response) => {
    //       if (!(response.ok && response.status === 200)) {
    //         throw new Error(`${response.status}`);
    //       }
    //       return response.text();
    //     })
    //     .then((responseJson) => {
    //       resolve(JSON.parse(responseJson));

    //     })
    //     .catch((error) => {
    //       reject(error);
    //     })
    // );
  });
