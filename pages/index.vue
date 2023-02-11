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
import { Suit } from '~/CardTypes';

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

    const { debug, solo, layout } = getDebugSettings();
    if (debug) {
      game.$patch((state) => {
        state.players[0].name = 'dealer';
        state.players[1].name = 'right';
        state.players[3].name = 'left';
      });
      if (solo) {
        game.$patch((state) => {
          state.players[2].name = 'partner';
        });
        deal();
      } else if (layout) {
        game.$patch((state) => {
          state.players[2].name = 'partner';
        });

        deal();

        game.$patch((state) => {
          state.players.forEach((p, i) => {
            const c = p.cards.pop();
            if (c && i !== 3) {
              p.played = c;
            }
          });

          state.players[0].bid = 2;
          state.players[1].bid = -1;
          state.players[2].bid = -1;
          state.players[3].bid = -1;
          state.trump = Suit.Diamonds;
          state.mode = Mode.Playing;
        });
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
