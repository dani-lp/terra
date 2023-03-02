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

export const Wide = Template.bind({});
Wide.args = {
  className: 'w-96',
};

export const Square = Template.bind({});
Square.args = {
  className: 'w-40 h-40',
};