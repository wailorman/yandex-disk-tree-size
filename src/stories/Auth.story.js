import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

// import { Button, Welcome } from '@storybook/react/demo';

import { Auth } from '../components/Auth';

storiesOf('Auth', module)
  .add('basic', () => <Auth onAuthClick={action('onAuthClick')} />)
  .add('loading', () => <Auth loading />);
