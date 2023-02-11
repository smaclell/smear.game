<template>
  <LobbyScreen v-if="showLobby" />
  <ScoreScreen v-else-if="showScore" />
  <GameScreen v-else />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import GameScreen from '@/screens/GameScreen.vue';
import LobbyScreen from '@/screens/LobbyScreen.vue';
import ScoreScreen from '@/screens/ScoreScreen.vue';
import { Mode, useGameStore } from '@/store/game';
import { getDebugSettings } from '@/store/debug';

export default defineComponent({
  name: 'IndexPage',
  components: {
    GameScreen,
    LobbyScreen,
    ScoreScreen,
  },
  setup() {
    const game = useGameStore();
    const { mode } = storeToRefs(game);
    const { deal } = game;

    const { debug, solo } = getDebugSettings();
    if (debug) {
      game.$patch((state) => {
        state.players[0].name = 'dealer';
        state.players[1].name = 'left';
        state.players[3].name = 'right';
      });
      if (solo) {
        game.$patch((state) => {
          state.players[2].name = 'partner';
        });
        deal();
      }
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
