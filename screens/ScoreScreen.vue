<template>
  <div ref="root" class="p-4 text-lg lg:text-xl gap-2 container">
    <div class="span-2 center text-4xl m-4 p-2 font-bold">
      <template v-if="done">
        <p v-if="red > blue" class="winning">You won!</p>
        <p v-else class="losing">You lost!</p>
      </template>
      <template v-else>
        <p v-if="red > blue" class="winning">Oh ya! You are winning!</p>
        <p v-else-if="blue > red" class="losing">Keep going! You can do it!</p>
        <p v-else class="tied">How did this happen? You are tied!</p>
      </template>
    </div>

    <p class="p-2 m-2 center">
      <strong>{{ players[0].name }} ɬ {{ players[2].name }}</strong> {{ red }}
    </p>
    <p class="p-2 m-2 center">
      <strong>{{ players[1].name }} ɬ {{ players[3].name }}</strong> {{ blue }}
    </p>

    <div
      v-for="score in scores"
      :key="score.id"
      class="p-2 m-2 shadow border-2 border-black border-solid rounded"
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

    <div class="my-4 mx-2 span-2 center">
      <StartButton v-if="debug || mode === 'Host'" />
      <template v-else-if="mode === 'Player'"> Waiting for the host! </template>
    </div>
  </div>
</template>

<script lang="ts">
import party from 'party-js';
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
  mounted() {
    if (this.$refs.root && this.red > this.blue) {
      // @ts-ignore
      party.confetti(this.$refs.root, {
        count: party.variation.range(20, 40),
      });
    }
  },
});
</script>

<style lang="postcss" scoped>
.container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: auto;
  margin: 0 auto;
  max-width: 640px;
}

.span-2 {
  grid-column: span 2 / span 2;
}

.center {
  justify-self: center;
}
</style>
