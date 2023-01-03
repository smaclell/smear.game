<template>
  <div class="outer-grid">
    <GameControls class="control-bar" />
    <PlayArea
      class="play-area"
      :bottom="players[0].played"
      :left="players[1].played"
      :top="players[2].played"
      :right="players[3].played"
    />
    <div class="player-0 self-end">
      <PlayerHand
        v-bind="players[0]"
        :active="active === 0 && !ready"
        :hide="false"
        position="bottom"
        @click="play"
      />
    </div>
    <div class="player-1 self-center">
      <PlayerHand
        v-bind="players[1]"
        :active="active === 1 && !ready"
        :hide="localId !== -1 && !debug"
        position="left"
        @click="play"
      />
    </div>
    <div class="player-2 self-start">
      <PlayerHand
        v-bind="players[2]"
        :active="active === 2 && !ready"
        :hide="localId !== -1 && !debug"
        position="top"
        @click="play"
      />
    </div>
    <div class="player-3 self-center">
      <PlayerHand
        v-bind="players[3]"
        :active="active === 3 && !ready"
        :hide="localId !== -1 && !debug"
        position="right"
        @click="play"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';
import { useConnectionsStore, DefaultGame } from '@/store/connections';
import { useGameStore } from '@/store/game';
import { getDebugSettings } from '@/store/debug';
import wait from '@/store/waiter';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const { debug } = getDebugSettings();

    const connections = useConnectionsStore();
    const { localId } = storeToRefs(connections);

    const store = useGameStore();
    const { players, mode, ready, active, trump, redScore, blueScore } =
      storeToRefs(store);
    const { play } = store;

    wait(store);

    return {
      debug,
      DefaultGame,
      localId,
      players,
      mode,
      ready,
      active,
      trump,
      redScore,
      blueScore,
      play,
    };
  },
});
</script>

<style lang="postcss" scoped>
.outer-grid {
  display: grid;
  grid-template:
    'p2 p2 p2'
    'p1 pa p3'
    'p0 p0 p0'
    'cb cb cb';
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: 1fr 3fr 1fr 1fr;
}

.play-area {
  grid-area: pa;
}

.player-0 {
  grid-area: p0;
}

.player-1 {
  grid-area: p1;
}

.player-2 {
  grid-area: p2;
}

.player-3 {
  grid-area: p3;
}

.control-bar {
  grid-area: cb;
}
</style>
