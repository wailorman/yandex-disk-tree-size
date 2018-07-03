import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import dirIcon from '../icons/dir.svg';
import fileIcon from '../icons/file.svg';
import downIcon from '../icons/down.svg';

const IconWrapper = styled.div`
  width: 30px;
  height: 30px;
  background-image: url(${({ icon }) => icon});
`;

export const Icon = (props) => {
  const iconsMap = {
    file: fileIcon,
    dir: dirIcon,
    down: downIcon,
  };

  const { type } = props;

  return <IconWrapper {...props} icon={iconsMap[type]} />;
};

Icon.propTypes = {
  type: PropTypes.oneOf(['file', 'dir', 'down']),
};

Icon.defaultProps = {
  type: 'dir',
};

export default Icon;
