/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '../configs/apiHeaders.js'

export const getPriceRange = async (params) => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/group-by/price-range`, {
      ...headers,
      params,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const getProductModel = async (params) => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/group-by/product-name`, {
      ...headers,
      params,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const getCompanyManufacturer = async (params) => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/group-by/company-name`, {
      ...headers,
      params,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const getBuySearch = async (data) => {
  try {
    const res = await axios.post(`${process.env.APP_SERVER_URL}/search/`, data, {
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
      withCredentials: false,
    });
    return res.data;
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log('Error', err.message);
    }
    throw err;
  }
};

export const getDetailSearch = async (inventoryId) => {
  try {
    const res = await axios
      .get(`${process.env.APP_SERVER_URL}/search/${inventoryId}`, {
        ...headers,
      });
    return res.data;
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log('Error', err.message);
    }
    throw err;
  }
};

export const getPopular = async () => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/popular-inventories`, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const getRecents = async () => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/recents-inventories`, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const getHotDeal = async () => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/popular-hotdeal-inventories`, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};
