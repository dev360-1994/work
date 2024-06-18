/* eslint-disable no-console */
import axios from 'axios';
// import { headers } from '@configs/apiHeaders.js';

// ** Add Contact
export const getReportContact = async (data) => {
  const headers = {
    withCredentials: false,
    responseType: 'blob',
  };

  await axios
    .post(`${process.env.APP_SERVER_URL}/api/Report/contacts`, data, {
      ...headers,
    })
    .then(async (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contact_report.csv');
      document.body.appendChild(link);
      link.click();
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

export const getReportProduct = async (data) => {
  const headers = {
    withCredentials: false,
    responseType: 'blob',
  };
  await axios
    .post(`${process.env.APP_SERVER_URL}/api/Report/products`, data, {
      ...headers,
    })
    .then(async (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'product_report.csv');
      document.body.appendChild(link);
      link.click();
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

export const getReportInventory = async (data) => {
  const headers = {
    withCredentials: false,
    responseType: 'blob',
  };

  await axios
    .post(`${process.env.APP_SERVER_URL}/api/Report/inventories`, data, {
      ...headers,
    })
    .then(async (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory_report.csv');
      document.body.appendChild(link);
      link.click();
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};
