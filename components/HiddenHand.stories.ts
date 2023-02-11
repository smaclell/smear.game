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
  position: 'top',
  player: {
    cards: [],
  },
};

export const One = Template.bind({});
One.args = {
  position: 'top',
  player: {
    cards: [Sentinel],
  },
};

export const Two = Template.bind({});
Two.args = {
  position: 'top',
  player: {
    cards: [Sentinel, Sentinel],
  },
};

export const Three = Template.bind({});
Three.args = {
  position: 'top',
  player: {
    cards: [Sentinel, Sentinel, Sentinel],
  },
};

export const Four = Template.bind({});
Four.args = {
  position: 'bottom',
  player: {
    cards: [Sentinel, Sentinel, Sentinel, Sentinel],
  },
};

export const Five = Template.bind({});
Five.args = {
  position: 'right',
  player: {
    cards: [Sentinel, Sentinel, Sentinel, Sentinel, Sentinel],
  },
};

export const Six = Template.bind({});
Six.args = {
  position: 'left',
  player: {
    cards: [Sentinel, Sentinel, Sentinel, Sentinel, Sentinel, Sentinel],
  },
};
