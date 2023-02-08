<template>
  <LobbyPage v-if="showLobby" />
  <ScorePage v-else-if="showScore" />
  <GamePage v-else />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import GamePage from './GamePage.vue';
import LobbyPage from './LobbyPage.vue';
import ScorePage from './ScorePage.vue';
import { Mode, useGameStore } from '@/store/game';
import { getDebugSettings } from '@/store/debug';

export default defineComponent({
  name: 'IndexPage',
  components: {
    GamePage,
    LobbyPage,
    ScorePage,
  },
  setup() {
    const game = useGameStore();
    const { mode } = storeToRefs(game);
    const { deal } = game;

    const { debug, solo } = getDebugSettings();
    if (debug && solo) {
      deal();
    }

    const showLobby = computed(() => mode.value === Mode.Start);
    const showScore = computed(() => mode.value === Mode.Score);

    return {
      showLobby,
      showScore,
    };
  },
});
</script>
