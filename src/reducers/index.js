import { combineReducers } from 'redux';
import { userReducer } from './user-reducer';
import { resourcesReducer } from './resources-reducer';

export const rootReducer = combineReducers({
  user: userReducer,
  resources: resourcesReducer,
});

export default rootReducer;
