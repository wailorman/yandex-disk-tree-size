import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

// import { Button, Welcome } from '@storybook/react/demo';
import { ContainerDecorator } from './decorators/ContainerDecorator';

import { Resource } from '../components/Resource';

storiesOf('Resource', module)
  .addDecorator(ContainerDecorator)

  .add('dir', () => (
    <Resource
      type="dir"
      onClick={action('onClick Directory')}
      name="Directory"
      size={13222244442}
    />
  ))

  .add('dir selected', () => (
    <Resource
      type="dir"
      onClick={action('onClick Directory')}
      name="Directory"
      size={13222244442}
      selected
    />
  ))

  .add('dir loading', () => (
    <Resource
      type="dir"
      onClick={action('onClick Directory')}
      name="Directory"
      size={13222244442}
      loading
    />
  ))

  .add('dir w/childrens', () => (
    <Resource
      type="dir"
      onClick={action('onClick Directory 0')}
      name="Directory 0"
      size={13222244442}
      selected
      loading
    >
      <Resource
        type="dir"
        onClick={action('onClick Directory 1')}
        name="Directory 1"
        size={2288600000}
      />
      <Resource
        type="dir"
        onClick={action('onClick Directory 2')}
        name="Directory 2"
        size={12288600000}
        selected
        loading
      >
        <Resource
          type="dir"
          onClick={action('onClick Directory 3')}
          name="Directory 3"
          size={2288600000}
        />
        <Resource
          type="dir"
          onClick={action('onClick Directory 4')}
          name="Directory 4"
          size={2288600000}
          loading
        />
        <Resource
          type="file"
          onClick={action('onClick qwerty.mp3')}
          name="qwerty.mp3"
          size={22434442}
        />
        <Resource
          type="file"
          onClick={action('onClick virus.exe')}
          name="virus.exe"
          size={27643456}
        />
      </Resource>
      <Resource type="file" onClick={action('onClick file.txt')} name="file.txt" size={22434442} />
    </Resource>
  ));
