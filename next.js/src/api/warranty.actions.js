/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@src/configs/apiHeaders.js';

// ** Get Contact
export const getWarranty = async (id) => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Warranty/${id}`, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Add Contact
export const addWarranty = async (data) => {
  try {
    const res = await axios
      .post(`${process.env.APP_SERVER_URL}/warranty-contact/`, data, {
        ...headers,
      });
    console.log('adfasdf', res);
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

// ** Get Contacts
export const getWarrants = async (params) => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Warranty/`, {
      ...headers,
      params,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Update Contact
export const updateWarranty = async (id, data) => {
  try {
    const res = await axios.put(`${process.env.APP_SERVER_URL}/api/Warranty/${id}`,
      data, { ...headers });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Delete Contact
export const deleteWarranty = async (id) => {
  try {
    const res = await axios.delete(`${process.env.APP_SERVER_URL}/api/Warranty/${id}`, {
      ...headers,
    });
    const data = await getWarranty(id);
    return data;
  } catch (err) {
    return '';
  }
};
