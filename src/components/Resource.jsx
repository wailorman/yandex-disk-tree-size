import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Spinner from 'react-spinkit';
import filesize from 'filesize';

import { Icon } from './Icon';

const Wrapper = styled.div`
  font-family: sans-serif;
  font-size: 0.85em;
  display: block;

  &:after {
    content: '';
    display: block;
    margin: 0 47px 0 10px;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
  }
`;

const Container = styled.div`
  padding: 10px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.025);
    cursor: pointer;
  }

  ${({ selected }) => selected && 'background-color: rgba(0,0,0,.05)'};

  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  & > * {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const IconWrapper = styled.div``;

const NameWrapper = styled.div``;

const SizeWrapper = styled.div`
  margin-left: auto;
  color: rgba(0, 0, 0, 0.5);
`;

const LoadingWrapper = styled.div`
  width: 27px;
`;

const StyledSpinner = styled(Spinner)``;

const ChildrenWrapper = styled.div`
  margin-left: 20px;
`;

export const Resource = ({
  name, size, loading, type, selected, children, onClick,
}) => (
  <div>
    <Wrapper>
      <Container selected={selected} onClick={onClick}>
        <IconWrapper>
          <Icon type={type} />
        </IconWrapper>
        <NameWrapper>{name}</NameWrapper>
        <SizeWrapper>{filesize(size)}</SizeWrapper>

        <LoadingWrapper>
          {loading && <StyledSpinner name="double-bounce" fadeIn={0} />}
        </LoadingWrapper>
      </Container>
    </Wrapper>
    <ChildrenWrapper>{children}</ChildrenWrapper>
  </div>
);

Resource.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  type: Icon.propTypes.type,
  loading: PropTypes.bool,
  selected: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any,
  onClick: PropTypes.func,
};

Resource.defaultProps = {
  name: '',
  size: 0,
  type: Icon.defaultProps.type,
  loading: false,
  selected: false,
  children: null,
  onClick: () => {},
};

export default Resource;
