import { Meta, StoryFn } from '@storybook/vue';
import PlayerHand from './PlayerHand.vue';
import { Suit } from '~/CardTypes';

export default {
  title: 'PlayerHand',
  component: PlayerHand,
} as Meta<typeof PlayerHand>;

const Template: StoryFn<typeof PlayerHand> = (_, { argTypes }) => ({
  components: { PlayerHand },
  props: Object.keys(argTypes),
  template: '<PlayerHand v-bind="$props" />',
});

const trump = Suit.Diamonds;
const led = { suit: Suit.Hearts, value: 2 };

const A = { suit: Suit.Hearts, value: 14 };
const B = { suit: Suit.Hearts, value: 11 };
const C = { suit: Suit.Diamonds, value: 11 };
const D = { suit: Suit.Clubs, value: 12 };
const E = { suit: Suit.Spades, value: 13 };
const F = { suit: Suit.Hearts, value: 7 };

const defaults = {
  led,
  trump,
  // eslint-disable-next-line no-console
  play: console.log,
};

export const Default = Template.bind({});
Default.args = {
  ...defaults,
  player: {
    id: 0,
    cards: [],
  },
};

export const One = Template.bind({});
One.args = {
  ...defaults,
  player: {
    id: 0,
    cards: [A],
  },
};

export const Two = Template.bind({});
Two.args = {
  ...defaults,
  player: {
    id: 0,
    cards: [A, B],
  },
};

export const Three = Template.bind({});
Three.args = {
  ...defaults,
  player: {
    id: 0,
    cards: [A, B, C],
  },
};

export const Four = Template.bind({});
Four.args = {
  ...defaults,
  player: {
    id: 0,
    cards: [A, B, C, D],
  },
};

export const Five = Template.bind({});
Five.args = {
  ...defaults,
  player: {
    id: 0,
    cards: [A, B, C, D, E],
  },
};

export const Six = Template.bind({});
Six.args = {
  ...defaults,
  player: {
    id: 0,
    cards: [A, B, C, D, E, F],
  },
};
