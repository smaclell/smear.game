import { Meta, StoryFn } from '@storybook/vue';
import PlayedCard from './PlayedCard.vue';
import { Card, Suit } from '~/CardTypes';

export default {
  title: 'PlayedCard',
  component: PlayedCard,
} as Meta<typeof PlayedCard>;

const Queen: Card = { suit: Suit.Hearts, value: 12 };
const Ace: Card = { suit: Suit.Spades, value: 14 };
const Ten: Card = { suit: Suit.Diamonds, value: 10 };
const Two: Card = { suit: Suit.Clubs, value: 2 };

const Template: StoryFn<typeof PlayedCard> = (_, { argTypes }) => ({
  components: { PlayedCard },
  props: Object.keys(argTypes),
  template: '<PlayedCard v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
  card: Queen,
};

export const Trump = Template.bind({});
Trump.args = {
  card: Ace,
  trump: Ace.suit,
};

export const Blocked = Template.bind({});
Blocked.args = {
  card: Ten,
  allowed: false,
};

export const Low = Template.bind({});
Low.args = {
  card: Two,
  trump: Two.suit,
};
