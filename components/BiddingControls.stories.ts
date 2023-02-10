import { Meta, StoryFn } from '@storybook/vue';
import BiddingControls from './BiddingControls.vue';

export default {
  title: 'BiddingControls',
  component: BiddingControls,
} as Meta<typeof BiddingControls>;

const Template: StoryFn<typeof BiddingControls> = (_, { argTypes }) => ({
  components: { BiddingControls },
  props: Object.keys(argTypes),
  template: '<BiddingControls v-bind="$props" :bid="() => {}" />',
});

export const NoBids = Template.bind({});
NoBids.args = {
  show: false,
  best: -1,
  winner: 'Lucy',
};

export const FirstBid = Template.bind({});
FirstBid.args = {
  show: true,
  best: -1,
  winner: 'Lucy',
};

export const LaterBid = Template.bind({});
LaterBid.args = {
  show: true,
  best: 3,
  winner: 'Lucy',
};

export const Waiting = Template.bind({});
Waiting.args = {
  show: false,
  best: 3,
  winner: 'Lucy',
};
