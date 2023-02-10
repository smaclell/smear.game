import { Meta, StoryFn } from '@storybook/vue';
import HiddenCard from './HiddenCard.vue';

export default {
  title: 'HiddenCard',
  component: HiddenCard,
} as Meta<typeof HiddenCard>;

const Template: StoryFn<typeof HiddenCard> = (_, { argTypes }) => ({
  components: { HiddenCard },
  props: Object.keys(argTypes),
  template: '<HiddenCard v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {};
