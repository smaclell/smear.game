import { mount } from '@vue/test-utils';
import PlayedCard from '@/components/PlayedCard.vue';

describe('PlayedCard', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(PlayedCard);
    expect(wrapper.vm).toBeTruthy();
  });
});
