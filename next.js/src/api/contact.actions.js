/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@src/configs/apiHeaders.js';


// ** Get Contact
export const getContact = async (id) => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Contact/${id}`, { ...headers });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Add Contact
export const addContact = async (data) => {
  try {
    const res = await axios.post(`${process.env.APP_SERVER_URL}/api/Contact`,data, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Get Contacts
export const getContacts = async (params) => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Contact`, {
      ...headers,
      params,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Update Contact
export const updateContact = async (id, data) => {
  console.log(data,"==>api data")
  try {
    const res = await axios.put(
      `${process.env.APP_SERVER_URL}/api/Contact/${id}`,
      data,
      {
        ...headers,
      }
    );
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Delete Contact
export const deleteContact = async (id) => {
  try {
    const res = await axios.delete(
      `${process.env.APP_SERVER_URL}/api/Contact/${id}`,
      {
        ...headers,
      }
    );
    return res.data;
  } catch (err) {
    return '';
  }
};

export const getLookupCountry = async () => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Lookup/countries`, {
      ...headers,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

export const getLookupState = async (countryCode) => {
  try {
    const params = {
      countryCode,
    };
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Lookup/states`, {
      ...headers,
      params,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

// ** Get Contacts
export const getRecentContacts = async (params) => {
  try {
    const res = await axios.get(`${process.env.APP_SERVER_URL}/api/Contact/recent`, {
      ...headers,
      params,
    });
    return res.data;
  } catch (err) {
    return '';
  }
};

export const updateSetInActive = async (id, params) => {
  try {
    console.log("Id"+id)
    const res = await axios.patch(`${process.env.APP_SERVER_URL}/api/Contact/${id}/set-inactive`, 
    params,
    {
      ...headers,
    
    });
    return res.data;
  } catch (err) {
    return '';
  }
};
