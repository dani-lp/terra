import * as React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { Modal } from './Modal';
import { Button } from '../button';

export default {
  title: 'Overlay/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Button onClick={() => setOpen(!open)}>Open</Button>
      <Modal {...args} open={open} setOpen={setOpen} />
    </>
  );
}

export const Empty = Template.bind({});
Empty.args = {
  className: 'h-44 w-96',
};

export const FixedHeight = Template.bind({});
FixedHeight.args = {
  className: 'h-96 w-96',
};
