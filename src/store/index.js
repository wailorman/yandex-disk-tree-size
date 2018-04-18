import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import {composeWithDevTools} from 'redux-devtools-extension';

import reducer from '../reducers';
import initialState from './state';

import history from './history';

const router = routerMiddleware(history);


const middlewares = [router, thunk];

// if (process.env.NODE_ENV !== 'production') {
//   middlewares.push(logger);
// }

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;
