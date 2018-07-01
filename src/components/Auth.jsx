import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { BigButton } from './BigButton';

const Page = styled.div`
  max-width: 720px;
  margin: 0 auto;
  transform: translateY(-50%);
  transform: translateX(-50%);
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  font-family: sans-serif;
`;

const Text = styled.div`
  padding: 5px 0;
`;

export const Auth = ({ loading, onAuthClick }) => (
  <Page>
    {loading ? (
      <Text>Загрузка...</Text>
    ) : (
      <div>
        <Text>Для начала работы с приложением необходимо авторизоваться</Text>
        <BigButton onClick={onAuthClick}>Авторизоваться через Яндекс</BigButton>
      </div>
    )}
  </Page>
);

Auth.propTypes = {
  onAuthClick: PropTypes.func,
  loading: PropTypes.bool,
};
Auth.defaultProps = {
  onAuthClick: () => {},
  loading: false,
};

export default Auth;
