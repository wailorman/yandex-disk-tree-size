import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import { rootReducer } from '../reducers/index';
import initialState from './state';

import { history } from './history';

// const router = routerMiddleware(history);

const middlewares = [thunk, routerMiddleware(history)];

const store = createStore(
  connectRouter(history)(rootReducer),
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

export default store;
