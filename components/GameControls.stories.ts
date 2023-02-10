import { Meta, StoryFn } from '@storybook/vue';
import GameControls from './GameControls.vue';
import { Suit } from '~/CardTypes';

export default {
  title: 'GameControls',
  component: GameControls,
} as Meta<typeof GameControls>;

const Template: StoryFn<typeof GameControls> = (_, { argTypes }) => ({
  components: { GameControls },
  props: Object.keys(argTypes),
  template: '<GameControls :red-score="7" :blue-score="10" v-bind="$props" />',
});

export const NoTrump = Template.bind({});
NoTrump.args = {
  trump: Suit.Invalid,
};

export const Hearts = Template.bind({});
Hearts.args = {
  trump: Suit.Hearts,
};

export const Spades = Template.bind({});
Spades.args = {
  trump: Suit.Spades,
};

export const Diamonds = Template.bind({});
Diamonds.args = {
  trump: Suit.Diamonds,
};

export const Clubs = Template.bind({});
Clubs.args = {
  trump: Suit.Clubs,
};
