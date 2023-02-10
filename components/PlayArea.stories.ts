import { Meta, StoryFn } from '@storybook/vue';
import PlayArea from './PlayArea.vue';
import { Card, Suit } from '~/CardTypes';

export default {
  title: 'PlayArea',
  component: PlayArea,
} as Meta<typeof PlayArea>;

const Queen: Card = { suit: Suit.Hearts, value: 12 };
const Ace: Card = { suit: Suit.Spades, value: 14 };
const Ten: Card = { suit: Suit.Diamonds, value: 10 };
const Two: Card = { suit: Suit.Clubs, value: 2 };

const Template: StoryFn<typeof PlayArea> = (_, { argTypes }) => ({
  components: { PlayArea },
  props: Object.keys(argTypes),
  template: '<PlayArea trump="Hearts" v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {};

export const Top = Template.bind({});
Top.args = {
  top: Queen,
};

export const Right = Template.bind({});
Right.args = {
  top: Queen,
  right: Ace,
};

export const Bottom = Template.bind({});
Bottom.args = {
  top: Queen,
  right: Ace,
  bottom: Ten,
};

export const Left = Template.bind({});
Left.args = {
  top: Queen,
  right: Ace,
  bottom: Ten,
  left: Two,
};
