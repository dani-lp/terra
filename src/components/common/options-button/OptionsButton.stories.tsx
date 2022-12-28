import * as React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { OptionsButton, type OptionsButtonOption } from './OptionsButton'; 

export default {
  title: 'General/OptionsButton',
  component: OptionsButton,
} as ComponentMeta<typeof OptionsButton>;

const Template: ComponentStory<typeof OptionsButton> = (args) => {
  const [selected, setSelected] = React.useState(args.options[0]);

  if (selected) {
    return <OptionsButton {...args} selected={selected} setSelected={setSelected} />
  }

  return <OptionsButton {...args} />;
};

const options: OptionsButtonOption[] = [
  { id: '1', label: 'Create challenge', description: 'The challenge will be visible by any account.' },
  { id: '2', label: 'Draft challenge', description: 'The challenge will be saved as a draft for you to publish later.' },
];

export const Default = Template.bind({});
Default.args = {
  options,
};