import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { Alert } from './Alert';

export default {
  title: 'General/Alert',
  component: Alert,
} as ComponentMeta<typeof Alert>;

const Template: ComponentStory<typeof Alert> = (args) => <Alert {...args} shown />;

export const Success = Template.bind({});
Success.args = {
  content: {
    title: 'Success Alert Title',
    type: 'success',
    message: 'This is an example of a success alert',
  },
};

export const Warning = Template.bind({});
Warning.args = {
  content: {
    title: 'Warning Alert Title',
    type: 'warning',
    message: 'This is an example of a warning alert',
  },
};

export const Error = Template.bind({});
Error.args = {
  content: {
    title: 'Error Alert Title',
    type: 'error',
    errors: ['This is an example of an error alert', 'This is an example of another error alert'],
  },
};
