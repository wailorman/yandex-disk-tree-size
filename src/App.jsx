import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';

import store from './store/index';
import { history } from './store/history';

import { RequireAuth } from './utils/RequireAuth';

import { HomeContainer } from './containers/HomeContainer';
import { AuthContainer } from './containers/AuthContainer';

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={RequireAuth(HomeContainer)} />
        <Route path="/auth" exact component={AuthContainer} />
      </Switch>
    </Router>
  </Provider>
);

export default App;
