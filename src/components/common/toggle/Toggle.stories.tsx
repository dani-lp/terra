import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { Toggle } from './Toggle';

export default {
  title: 'General/Toggle',
  component: Toggle,
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = (args) => <Toggle {...args} />;

export const Enabled = Template.bind({});
Enabled.args = {
  enabled: true, 
};

export const Disabled = Template.bind({});