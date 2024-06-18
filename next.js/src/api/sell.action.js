/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@src/configs/apiHeaders.js';

export const getLaserType = async () => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Lookup/laser-types`, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

export const getFullProductModel = async () => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Product/active`, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

export const addSellProductInventory = async (data) => {
  try {
    const res = await axios
      .post(`${process.env.APP_SERVER_URL}/api/public/sell`, data, {
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
