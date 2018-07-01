import { createSelector } from 'reselect';

export const userSelector = state => state.user;

export const isLoading = createSelector(userSelector, ({ loading }) => !!loading);

export const isAuthenticated = createSelector(
  userSelector,
  userState => !!userState.isAuthenticated,
);
