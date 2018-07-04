import { combineReducers } from 'redux';

import * as AT from '../constants/action-types';

export const objectsReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case AT.RESOURCE_FETCH_SUCCESS:
      return action.payload.resources.reduce((prev, curResource) => ({
        ...prev,
        [curResource.id]: curResource,
      }), state);

    default:
      return state;
  }
};

export const resourcesReducer = combineReducers({ objects: objectsReducer });

export default resourcesReducer;
