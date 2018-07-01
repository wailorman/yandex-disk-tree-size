import { combineReducers } from 'redux';
import * as AT from '../constants/action-types';

export const loading = (state = true, action = {}) => {
  switch (action.type) {
    case AT.AUTH_FETCH:
      return true;

    case AT.AUTH_SUCCESS:
    case AT.AUTH_FAILURE:
      return false;

    default:
      return state;
  }
};

export const isAuthenticated = (state = false, action = {}) => {
  switch (action.type) {
    case AT.AUTH_FETCH:
    case AT.AUTH_FAILURE:
      return false;

    case AT.AUTH_SUCCESS:
      return true;

    default:
      return state;
  }
};

export const userReducer = combineReducers({
  loading,
  isAuthenticated,
});
