import { combineReducers } from 'redux';

import * as AT from '../constants/action-types';

export const objectsReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case AT.RESOURCE_CHILDS_FETCH_SUCCESS:
      return action.payload.resources.reduce(
        (prev, curResource) => ({
          ...prev,
          [curResource.id]: curResource,
        }),
        state,
      );

    default:
      return state;
  }
};

export const openedReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case AT.CHANGE_RESOURCE_COLLAPSED_STATE:
      return {
        ...state,
        [action.payload.id]: action.payload.state,
      };

    default:
      return state;
  }
};

export const loadingReducer = (state = {}, action = {}) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const belongsToRelationsReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case AT.RESOURCE_CHILDS_FETCH_SUCCESS:
      return action.payload.resources.reduce(
        (prev, curResource) => ({
          ...prev,
          [curResource.id]: curResource.parentResourceId,
        }),
        state,
      );

    default:
      return state;
  }
};
export const hasManyRelationsReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case AT.RESOURCE_CHILDS_FETCH_SUCCESS:
      return action.payload.resources.reduce(
        (prev, curResource) => ({
          ...prev,
          [curResource.parentResourceId]: {
            ...(prev[curResource.parentResourceId] || {}),
            [curResource.id]: true,
          },
        }),
        state,
      );

    default:
      return state;
  }
};

export const resourcesReducer = combineReducers({
  objects: objectsReducer,
  opened: openedReducer,
  loading: loadingReducer,
  belongsToRelations: belongsToRelationsReducer,
  hasManyRelations: hasManyRelationsReducer,
});

export default resourcesReducer;
