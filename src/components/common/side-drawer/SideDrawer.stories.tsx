import * as React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { SideDrawer } from './SideDrawer';
import { Button } from '../button';

export default {
  title: 'Overlay/SideDrawer',
  component: SideDrawer,
  args: {
    srCloseLabel: 'Close panel'
  },
} as ComponentMeta<typeof SideDrawer>;

const Template: ComponentStory<typeof SideDrawer> = (args) => {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Button onClick={() => setOpen(!open)}>Open</Button>
      <SideDrawer {...args} open={open} setOpen={setOpen} />
    </>
  );
}

export const Default = Template.bind({});

export const WithTitle = Template.bind({});
WithTitle.args = {
  title: 'Title',
};

export const Wide = Template.bind({});
Wide.args = {
  className: 'max-w-xl',
};