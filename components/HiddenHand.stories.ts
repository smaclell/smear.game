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
  player: {
    cards: [],
  },
};

export const One = Template.bind({});
One.args = {
  player: {
    cards: [Sentinel],
  },
};

export const Two = Template.bind({});
Two.args = {
  player: {
    cards: [Sentinel, Sentinel],
  },
};

export const Three = Template.bind({});
Three.args = {
  player: {
    cards: [Sentinel, Sentinel, Sentinel],
  },
};

export const Four = Template.bind({});
Four.args = {
  player: {
    cards: [Sentinel, Sentinel, Sentinel, Sentinel],
  },
};

export const Five = Template.bind({});
Five.args = {
  player: {
    cards: [Sentinel, Sentinel, Sentinel, Sentinel, Sentinel],
  },
};

export const Six = Template.bind({});
Six.args = {
  player: {
    cards: [Sentinel, Sentinel, Sentinel, Sentinel, Sentinel, Sentinel],
  },
};
