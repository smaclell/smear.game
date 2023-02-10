import GameControls from './GameControls.vue';
import { Suit } from '~/CardTypes';

export default {
  title: 'GameControls',
  component: GameControls,
};

type Props = {
  trump: Suit;
};

const Template = (args: Props) => ({
  components: { GameControls },
  setup() {
    return { args };
  },
  template: '<GameControls :red-score="7" :blue-score="10" v-bind="args" />',
});

export const NoTrump = Template.bind({});
// @ts-ignore - storybook wants this
NoTrump.args = {
  trump: Suit.Invalid,
};

export const Hearts = Template.bind({});
// @ts-ignore - storybook wants this
Hearts.args = {
  trump: Suit.Hearts,
};

export const Spades = Template.bind({});
// @ts-ignore - storybook wants this
Spades.args = {
  trump: Suit.Spades,
};

export const Diamonds = Template.bind({});
// @ts-ignore - storybook wants this
Diamonds.args = {
  trump: Suit.Diamonds,
};

export const Clubs = Template.bind({});
// @ts-ignore - storybook wants this
Clubs.args = {
  trump: Suit.Clubs,
};
