import { Meta, StoryFn } from '@storybook/vue';
import PlayerLabel from './PlayerLabel.vue';

export default {
  title: 'PlayerLabel',
  component: PlayerLabel,
} as Meta<typeof PlayerLabel>;

const Template: StoryFn<typeof PlayerLabel> = (_, { argTypes }) => ({
  components: { PlayerLabel },
  props: Object.keys(argTypes),
  template: '<PlayerLabel v-bind="$props" />',
});

export const Initial = Template.bind({});
Initial.args = {
  active: 1,
  id: 0,
  bid: 0,
  name: 'You',
};

export const Bid = Template.bind({});
Bid.args = {
  active: 1,
  id: 0,
  bid: 2,
  name: 'You',
};

export const Pass = Template.bind({});
Pass.args = {
  active: 1,
  id: 0,
  bid: -1,
  name: 'You',
};

export const Playing = Template.bind({});
Playing.args = {
  active: 1,
  id: 1,
  bid: -1,
  name: 'You',
};

export const Bidding = Template.bind({});
Bidding.args = {
  active: 1,
  id: 1,
  bid: 0,
  name: 'You',
};
