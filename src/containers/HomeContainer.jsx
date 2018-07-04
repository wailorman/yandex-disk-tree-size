import React from 'react';
// import PropTypes from 'prop-types';
// import lifecycle from 'react-pure-lifecycle';
import { connect } from 'react-redux';
import compose from 'compose-function';
import styled from 'styled-components';

import * as ResourceActions from '../actions/resource-actions';

import { ResourceContainer } from './ResourceContainer';

const PageWrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  margin-top: 30px;
`;

export const HomeContainer = compose(
  connect(
    null,
    dispatch => ({
      fetchResources: () => dispatch(ResourceActions.fetchResources()),
    }),
  ),
  // lifecycle({
  //   componentDidMount({ fetchResources }) {
  //     fetchResources();
  //   },
  // }),
)(({ fetchResources }) => (
  <PageWrapper>
    <button type="button" onClick={fetchResources}>
      Fetch
    </button>
    <ResourceContainer />
  </PageWrapper>
));

HomeContainer.propTypes = {};
HomeContainer.defaultProps = {};

export default HomeContainer;
