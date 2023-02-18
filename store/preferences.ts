import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    sound: useLocalStorage('pinia/preferences/sound', true),
  }),
});
