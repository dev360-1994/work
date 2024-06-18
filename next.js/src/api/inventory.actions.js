/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@src/configs/apiHeaders.js';

// ** Get Inventory
export const getInventory = async (id) => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Inventory/${id}`, { ...headers });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Add Inventory
export const addInventory = async (data) => {
  try {
    const res = await axios.post(`${process.env.APP_SERVER_URL}/api/Inventory`,data, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Get Inventory
export const getInventorys = async (params) => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Inventory`, {
      ...headers,
      params,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Update Inventory
export const updateInventory = async (id, data) => {
  try {
    const res = await axios.put(`${process.env.APP_SERVER_URL}/api/Inventory/${id}`, data, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Delete Inventory
export const deleteInventory = async (id) => {
  try {
    const res = await axios.delete(`${process.env.APP_SERVER_URL}/api/Inventory/${id}`, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

export const updateInventoryActive = async (id, data) => {
  await axios
    .patch(
      `${process.env.APP_SERVER_URL}/api/Inventory/${id}/update-active?isActive=`+data,
      data,
      {
        ...headers,
      }
    )
    .then((response) => response.data)
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

export const updateInventoryWarranty = async (id, data) => {
  await axios
    .patch(
      `${process.env.APP_SERVER_URL}/api/Inventory/${id}/update-warranty?isWarranty=`+data,
      data,
      {
        ...headers,
      }
    )
    .then((response) => response.data)
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

export const updateInventoryViewsIncreament = async (id) => {
  await axios
    .patch(
      `${process.env.APP_SERVER_URL}/api/Inventory/${id}/increament-views`, {},
      {
        ...headers,
      }
    )
    .then((response) => response)
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};
