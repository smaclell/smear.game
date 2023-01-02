<template>
  <div class="grid grid-cols-3 grid-rows-4 h-screen">
    <GameControls class="col-span-3 row-start-4" />
    <PlayArea
      class="col-start-2 row-start-2"
      :bottom="players[0].played"
      :left="players[1].played"
      :top="players[2].played"
      :right="players[3].played"
    />
    <PlayerHand
      class="col-span-3 col-start-1 row-start-3 self-end"
      v-bind="players[0]"
      :active="active === 0 && !ready"
      :hide="false"
      @click="play"
    />
    <PlayerHand
      class="row-span-3 row-start-1 col-start-1 self-center"
      v-bind="players[1]"
      :active="active === 1 && !ready"
      :hide="localId !== -1 && !debug"
      @click="play"
    />
    <PlayerHand
      class="col-span-3 col-start-1 row-start-1 self-start"
      v-bind="players[2]"
      :active="active === 2 && !ready"
      :hide="localId !== -1 && !debug"
      @click="play"
    />
    <PlayerHand
      class="row-span-3 row-start-1 col-start-3 self-center"
      v-bind="players[3]"
      :active="active === 3 && !ready"
      :hide="localId !== -1 && !debug"
      @click="play"
    />
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
