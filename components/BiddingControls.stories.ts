import BiddingControls from './BiddingControls.vue';

export default {
  title: 'BiddingControls',
  component: BiddingControls,
};

type Props = {
  show: boolean;
  best: number;
  winner: string;
};

const Template = (args: Props) => ({
  components: { BiddingControls },
  setup() {
    return { args };
  },
  template: '<BiddingControls v-bind="args" :bid="() => {}" />',
});

export const NoBids = Template.bind({});
// @ts-ignore - storybook wants this
NoBids.args = {
  show: false,
  best: -1,
  winner: 'Lucy',
};

export const FirstBid = Template.bind({});
// @ts-ignore - storybook wants this
FirstBid.args = {
  show: true,
  best: -1,
  winner: 'Lucy',
};

export const LaterBid = Template.bind({});
// @ts-ignore - storybook wants this
LaterBid.args = {
  show: true,
  best: 3,
  winner: 'Lucy',
};

export const Waiting = Template.bind({});
// @ts-ignore - storybook wants this
Waiting.args = {
  show: false,
  best: 3,
  winner: 'Lucy',
};
