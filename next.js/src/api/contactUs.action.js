/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@src/configs/apiHeaders.js';

export const addContactUsProductInventory = async (data) => {
  try {
    const headers = {
      withCredentials: false,
      'Content-Type': 'application/json',
    };

    const res = await axios
      .post(`${process.env.APP_SERVER_URL}/api/public/contact-us`, data, {
        ...headers,
      });
    return res.data;
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log('Error', err.message);
    }
    return '';
  }
};

export const RemoveWatch = async (data) => {
  try {
    const headers = {
      withCredentials: false,
      'Content-Type': 'application/json',
    };

    const res = await axios
      .post(`${process.env.APP_SERVER_URL}/api/public/contact-us`, data, {
        ...headers,
      });
    return res.data;
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log('Error', err.message);
    }
    return '';
  }
};

export const addContactUsProductMaintainance = async (data) => {
  try {
 
    const res = await axios.post(`${process.env.APP_SERVER_URL}/api/public/maintainance-contact-us`,data, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};
