/* eslint-disable import/prefer-default-export */
import axios from 'axios';

export const isAuthenticated = async () => {
  const {
    data: { response },
  } = await axios.get(`${process.env.REACT_APP_API_URL}/api/is-authenticated`, {
    withCredentials: true,
  });
  return response;
};
