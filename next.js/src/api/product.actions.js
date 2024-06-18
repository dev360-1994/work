/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@src/configs/apiHeaders.js';

// ** Get Contact
export const getProduct = async (id) => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Product/${id}`, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Add Contact
export const addProduct = async (data) => {
  try {
    const res = await axios.post(`${process.env.APP_SERVER_URL}/api/Product`,data, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Get Products
export const getProducts = async (params) => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Product`, {
      ...headers,
      params,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Update Contact
export const updateProduct = async(id, data)  => { //=> async (dispatch, getState) remove this code
 // console.log("<<<<updateProduct>>>>>>>>>>>>>>"+data)
  try {
    const res = await axios.put(`${process.env.APP_SERVER_URL}/api/Product/${id}`, data, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Delete Product
export const deleteProduct = async (id) => {
  try {
    const res = await axios.delete(`${process.env.APP_SERVER_URL}/api/Product/${id}`, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

export const getLookupProductOption = async () => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Lookup/product-options`, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    console.log('Error', err.message);
    return '';
  }
};

export const getProductActive = async () => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Product/active`, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    console.log('Error', err.message);
    return '';
  }
};
