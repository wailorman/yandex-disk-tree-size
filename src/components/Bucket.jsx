import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: #ffd96933;
  padding: 20px 40px;
  font-family: sans-serif;
  font-size: 1.1em;
  color: rgba(0, 0, 0, 0.7);
`;

const ChildrenWrapper = styled.div`
  padding-left: 30px;
`;

export const Bucket = props => (
  <div>
    <Wrapper {...props}>{props.name}</Wrapper>
    <ChildrenWrapper>{props.children}</ChildrenWrapper>
  </div>
);

Bucket.propTypes = {
  name: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any,
};
Bucket.defaultProps = {
  name: '',
  children: null,
};

export default Bucket;
