import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { Skeleton } from './Skeleton';

export default {
  title: 'General/Skeleton',
  component: Skeleton,
} as ComponentMeta<typeof Skeleton>;

const Template: ComponentStory<typeof Skeleton> = (args) => {
  return (
    <Skeleton {...args} />
  );
}

export const Default = Template.bind({});
Default.args = {
  className: 'h-10 w-30',
};

export const Wide = Template.bind({});
Wide.args = {
  className: 'h-40 w-96',
};

export const Square = Template.bind({});
Square.args = {
  className: 'h-40 w-40',
};