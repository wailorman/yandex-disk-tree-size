import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

// import { Button, Welcome } from '@storybook/react/demo';
import { ContainerDecorator } from './decorators/ContainerDecorator';

import { Bucket } from '../components/Bucket';
import { Resource } from '../components/Resource';

storiesOf('Bucket', module)
  .addDecorator(ContainerDecorator)
  .add('regular', () => <Bucket name="Яндекс.Диск" />)
  .add('w/children', () => (
    <Bucket name="Яндекс.Диск">
      <Resource
        type="dir"
        name="Directory"
        size={13222244442}
      />
    </Bucket>
  ));
