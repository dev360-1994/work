export const headers = {
  // 'Content-Type': 'application/json',
  // Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  withCredentials: false,
};

export const headers1 = {
  'Content-Type': 'multipart/form-data',
  // Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  withCredentials: false,
};

export const headersMedia = {
  'Content-Type': 'multipart/form-data',
  // Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  withCredentials: true,
};
