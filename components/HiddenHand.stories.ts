import { Meta, StoryFn } from '@storybook/vue';
import HiddenHand from './HiddenHand.vue';
import { Sentinel } from '~/CardTypes';

export default {
  title: 'HiddenHand',
  component: HiddenHand,
} as Meta<typeof HiddenHand>;

const Template: StoryFn<typeof HiddenHand> = (_, { argTypes }) => ({
  components: { HiddenHand },
  props: Object.keys(argTypes),
  template: '<HiddenHand v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
  cards: [],
  position: 'top',
};

export const One = Template.bind({});
One.args = {
  cards: [Sentinel],
  position: 'top',
};

export const Two = Template.bind({});
Two.args = {
  cards: [Sentinel, Sentinel],
  position: 'top',
};

export const Three = Template.bind({});
Three.args = {
  cards: [Sentinel, Sentinel, Sentinel],
  position: 'top',
};

export const Four = Template.bind({});
Four.args = {
  cards: [Sentinel, Sentinel, Sentinel, Sentinel],
  position: 'bottom',
};

export const Five = Template.bind({});
Five.args = {
  cards: [Sentinel, Sentinel, Sentinel, Sentinel, Sentinel],
  position: 'right',
};

export const Six = Template.bind({});
Six.args = {
  cards: [Sentinel, Sentinel, Sentinel, Sentinel, Sentinel, Sentinel],
  position: 'left',
};
