/* eslint-disable import/prefer-default-export */
import * as AT from '../constants/action-types';
import * as Methods from '../api/methods';

export const pullUserInfo = () => async (dispatch) => {
  dispatch({ type: AT.AUTH_FETCH });

  const isAuthenticated = await Methods.isAuthenticated();

  if (isAuthenticated) {
    dispatch({ type: AT.AUTH_SUCCESS });
  } else {
    dispatch({ type: AT.AUTH_FAILURE });
  }
};
