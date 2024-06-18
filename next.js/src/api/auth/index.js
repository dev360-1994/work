/* eslint-disable consistent-return */
// ** UseJWT import to get config
import useJwt from '@src/components/auth/useJwt';
import axios from 'axios';
import { headers } from '@src/configs/apiHeaders.js';

const config = useJwt.jwtConfig;

// ** Handle User Login
export const handleLogin = (data) => (dispatch) => {
  // no need to store in store
  dispatch({
    type: 'LOGIN',
    data,
    config,
    // [config.storageTokenKeyName]: data[config.storageTokenKeyName],
  });

  // ** Add to user, accessToken to localStorage
  if (data.accessToken) {
    localStorage.setItem(config.storageTokenKeyName, data.accessToken);
    delete data.accessToken;
  }
  localStorage.setItem('userData', JSON.stringify(data));
};

// ** Handle User Logout
export const handleLogout = () => {
  // ** Remove user, accessToken from localStorage
  localStorage.removeItem('userData');
  localStorage.removeItem(config.storageTokenKeyName);
};

export const login = async (Username, password) => {
  try {
    const res = await axios.post(`${process.env.APP_SERVER_URL}/api/Auth/login`, { Username, password }, { ...headers });
    return res;
  } catch (err) {
    const { errors } = err.response.data;
    return errors;
  }
};
