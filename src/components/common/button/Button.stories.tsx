import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button } from './Button';

export default {
  title: 'General/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args}>Button</Button>; 

export const Primary = Template.bind({});

export const Inverse = Template.bind({});
Inverse.args = {
  variant: 'inverse',
};

export const Long = Template.bind({});
Long.args = {
  className: 'w-64',
};