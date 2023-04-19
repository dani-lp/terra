import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { Chip } from './Chip';

export default {
  title: 'General/Chip',
  component: Chip,
} as ComponentMeta<typeof Chip>;

const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args} />;

export const Green = Template.bind({});
Green.args = {
  label: 'Green',
};

export const Red = Template.bind({});
Red.args = {
  label: 'Red',
  className: 'bg-red-100 text-red-800',
};

export const Blue = Template.bind({});
Blue.args = {
  label: 'Blue',
  className: 'bg-blue-100 text-blue-800',
};