// import React from 'react';
// import PropTypes from 'prop-types';
import compose from 'compose-function';
import { connect } from 'react-redux';
import lifecycle from 'react-pure-lifecycle';
import { withRouter } from 'react-router-dom';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';

import { Auth } from '../components/Auth';

import * as UserSelectors from '../selectors/user-selectors';
import * as UserActions from '../actions/user-actions';

// https://mjrussell.github.io/redux-auth-wrapper/docs/Getting-Started/ReactRouter4.html
const locationHelper = locationHelperBuilder({});
const userIsNotAuthenticated = connectedRouterRedirect({
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
  allowRedirectBack: false,
  authenticatedSelector: state => !UserSelectors.isAuthenticated(state),
});

export const AuthContainer = compose(
  connect(
    state => ({
      loading: UserSelectors.isLoading(state),
      isAuthenticated: UserSelectors.isAuthenticated(state),
    }),
    dispatch => ({
      onAuthClick: () =>
        window.location.replace(
          `${process.env.REACT_APP_API_URL}/api/yandex/auth?redirect_url=${window.location.href}`,
        ),
      pullUserInfo: () => {
        dispatch(UserActions.pullUserInfo());
      },
    }),
  ),
  lifecycle({
    componentDidMount({ pullUserInfo }) {
      pullUserInfo();
    },
  }),
  withRouter,
  userIsNotAuthenticated,
)(Auth);

export default AuthContainer;
