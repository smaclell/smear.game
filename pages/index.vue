<template>
  <div class="grid grid-cols-3 grid-rows-4 h-screen">
    <div class="col-span-3 row-start-4">
      <div v-if="mode === 'Bidding'">
        <span>Bid</span>
        <button class="btn btn-blue" @click="bid(active, 0)">Pass</button>
        <button
          class="btn btn-blue"
          :disabled="maxBid[0] >= 2"
          @click="bid(active, 2)"
        >
          2
        </button>
        <button
          class="btn btn-blue"
          :disabled="maxBid[0] >= 3"
          @click="bid(active, 3)"
        >
          3
        </button>
        <button
          class="btn btn-blue"
          :disabled="maxBid[0] >= 4"
          @click="bid(active, 4)"
        >
          4
        </button>
      </div>
      <div>
        <span>{{ mode }}</span>
        <button class="btn btn-blue" :disabled="!ready" @click="next">
          Next
        </button>
      </div>
      <div>
        <span><strong>Trump:</strong> {{ trump }}</span>
        <span><strong>Active:</strong> {{ players[active].name }}</span>
        <span><strong>Red:</strong> {{ redScore }}</span>
        <span><strong>Blue:</strong> {{ blueScore }}</span>
        <span><strong>Bid:</strong> {{ maxBid }}</span>
      </div>
    </div>
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
      :active="active === 0"
      @click="play"
    />
    <PlayerHand
      class="row-span-3 row-start-1 col-start-1 self-center"
      v-bind="players[1]"
      :active="active === 1"
      @click="play"
    />
    <PlayerHand
      class="col-span-3 col-start-1 row-start-1 self-start"
      v-bind="players[2]"
      :active="active === 2"
      @click="play"
    />
    <PlayerHand
      class="row-span-3 row-start-1 col-start-3 self-center"
      v-bind="players[3]"
      :active="active === 3"
      @click="play"
    />
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';
import { Mode, useGameStore } from '@/store/game';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const store = useGameStore();
    const { players, mode, ready, active, trump, redScore, blueScore, maxBid } =
      storeToRefs(store);
    const { bid, play, next } = store;

    let waiting: NodeJS.Timeout | null = null;

    function clear() {
      waiting = null;
      if (next()) {
        clear();
      }
    }

    function wait() {
      if (waiting || !ready.value || mode.value === Mode.Game) {
        return;
      }

      const delay =
        mode.value === Mode.Score || mode.value === Mode.Bidding ? 4500 : 1500;
      waiting = setTimeout(clear, delay);
    }

    clear();

    store.$onAction(({ name, after }) => {
      if (name !== 'next') {
        after((result) => {
          result && wait();
        });
      }
    });

    return {
      players,
      mode,
      ready,
      active,
      trump,
      redScore,
      blueScore,
      maxBid,
      bid,
      play,
      next,
    };
  },
});
</script>

<style lang="postcss" scoped>
.btn {
  @apply font-bold py-2 px-4 rounded;
}

.btn-blue {
  @apply bg-blue-500 text-white;
}

.btn-blue:hover {
  @apply bg-blue-700;
}

[disabled] {
  @apply opacity-50 cursor-not-allowed;
}
</style>
