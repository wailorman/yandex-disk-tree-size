import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

export const ContainerDecorator = story => <Wrapper>{story()}</Wrapper>;

export default ContainerDecorator;
