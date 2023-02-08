import { mount } from '@vue/test-utils';
import PlayedCard from '@/components/PlayedCard.vue';

describe('PlayedCard', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(PlayedCard, {
      props: {
        card: { suit: 'Hearts', value: 11 },
        hide: false,
        allowed: true,
        trump: true,
      },
    });
    expect(wrapper.vm).toBeTruthy();
  });
});
