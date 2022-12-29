import * as React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { 
  BellIcon,
  BookmarkIcon,
  UserIcon,
} from '@heroicons/react/24/solid';

import {
  SelectField,
  type SelectOptionWithImage,
  type SelectOption,
  type SelectOptionWithIcon
} from './SelectField';

export default {
  title: 'General/SelectField',
  component: SelectField,
} as ComponentMeta<typeof SelectField>;

const Template: ComponentStory<typeof SelectField> = (args) => {
  const [selected, setSelected] = React.useState(args.options[0]);

  if (selected) {
    return <SelectField {...args} selected={selected} setSelected={setSelected} />
  }

  return <SelectField {...args} />;
}

const options: SelectOption[] = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
  { id: '4', label: 'Option 4' },
  { id: '5', label: 'Option 5' },
  { id: '6', label: 'Option 6' },
  { id: '7', label: 'Option 7' },
  { id: '8', label: 'Option 8' },
];

const optionsWithImage: SelectOptionWithImage[] = [
  { id: '1', label: 'Option 1', image: '/logo.png', alt: 'Img 1' },
  { id: '2', label: 'Option 2', image: '/logo.png', alt: 'Img 2' },
  { id: '3', label: 'Option 3', image: '/logo.png', alt: 'Img 3' },
  { id: '4', label: 'Option 4', image: '/logo.png', alt: 'Img 4' },
  { id: '5', label: 'Option 5', image: '/logo.png', alt: 'Img 5' },
  { id: '6', label: 'Option 6', image: '/logo.png', alt: 'Img 6' },
  { id: '7', label: 'Option 7', image: '/logo.png', alt: 'Img 7' },
  { id: '8', label: 'Option 8', image: '/logo.png', alt: 'Img 8' },
];

const optionsWithIcon: SelectOptionWithIcon[] = [
  { id: '1', label: 'People', icon: UserIcon },
  { id: '2', label: 'Notifications', icon: BellIcon },
  { id: '3', label: 'Bookmarks', icon: BookmarkIcon },
];

export const Default = Template.bind({});
Default.args = {
  options,
  selected: options[0],
};

export const WithImage = Template.bind({});
WithImage.args = {
  options: optionsWithImage,
  selected: optionsWithImage[0],
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  options: optionsWithIcon,
  selected: optionsWithIcon[0],
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  options,
  label: 'Select an option',
};