import axios from 'axios';
import promise from 'promise';
import Constants from 'expo-constants';

axios.interceptors.request.use(
  request => requestHandler(request),
  error => errorHandler(error)
)
// axios.interceptors.request.eject(requestObj);
axios.interceptors.response.use(
  response => responseHandler(response),
  error => errorHandler(error)
  
)
//  axios.interceptors.response.eject(responseObj);
const responseHandler = (response) => {
  return response;
}
const errorHandler = (err) => {
  return promise.reject(err);
};
const requestHandler = (request) => {
  return request;
};