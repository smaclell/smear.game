<template>
  <div class="p-4">
    <template v-if="done">
      <p v-if="red > blue" class="text-2xl p-2 winning">You won!</p>
      <p v-else class="text-2xl p-2 losing">You lost!</p>
    </template>
    <template v-else>
      <p v-if="red > blue" class="text-2xl p-2 winning">
        Oh ya! You are winning!
      </p>
      <p v-else-if="blue > red" class="text-2xl p-2 losing">
        Keep going! You can do it!
      </p>
      <p v-else class="text-2xl p-2 tied">How did this happen? You are tied!</p>
    </template>

    <div class="text-xl p-2">
      <p><strong>Us:</strong> {{ red }}</p>
      <p><strong>Them:</strong> {{ blue }}</p>
    </div>

    <div
      v-for="score in scores"
      :key="score.id"
      class="text-xl p-2 m-2 shadow border-2 border-black border-solid rounded"
    >
      <p>
        <strong>{{ players[score.id].name }}</strong>
      </p>
      <p>
        <label>Bid:</label>
        {{ score.bid > 0 ? score.bid : 'pass' }}
      </p>
      <p>
        <label>Game:</label>
        {{ score.gamePoints }}
      </p>
      <p v-if="score.highest">Won High</p>
      <p v-if="score.jack">Won Jack</p>
      <p v-if="score.jick">Won Jick</p>
      <p v-if="score.lowest">Won Low</p>
      <p v-if="score.game">Won Game</p>
    </div>

    <div class="my-4 mx-2">
      <StartButton v-if="debug || mode === 'Host'" />
      <template v-else-if="mode === 'Player'"> Waiting for the host! </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { getDebugSettings } from '@/store/debug';
import { useConnectionsStore } from '@/store/connections';
import { useGameStore } from '@/store/game';
import { useScoreStore } from '@/store/score';

export default defineComponent({
  name: 'ScoreScreen',
  setup() {
    const { debug } = getDebugSettings();

    const connections = useConnectionsStore();
    const { mode } = storeToRefs(connections);

    const game = useGameStore();
    const { players } = storeToRefs(game);

    const store = useScoreStore();
    const { done, red, blue, scores } = storeToRefs(store);

    return {
      debug,
      mode,
      done,
      red,
      blue,
      players,
      scores,
    };
  },
});
</script>
