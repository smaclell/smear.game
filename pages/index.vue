<template>
  <div class="grid grid-cols-3 grid-rows-4 h-screen">
    <div class="col-span-3 row-start-4 text-2xl">
      <div v-if="connectionMode === 'Lobby'" class="my-4">
        <strong>Connection:</strong>
        <button class="btn btn-blue" @click="host(DefaultGame)">Host</button>
        <button class="btn btn-blue" @click="join(DefaultGame)">Join</button>
      </div>
      <div v-if="connectionMode === 'Host'" class="my-4">
        <button
          v-if="mode === 'Dealing' || mode === 'Game'"
          class="btn btn-blue"
          @click="deal"
        >
          Start
        </button>
        <template v-if="debug">
          <p><strong>Mode:</strong> {{ mode }}</p>
          <button class="btn btn-blue" :disabled="!ready" @click="next">
            Next
          </button>
        </template>
      </div>
      <div class="my-4">
        <p>
          <strong>Trump:</strong> {{ trump }}
          <span :class="[red ? 'text-red-500' : 'text-black']">{{
            emoji
          }}</span>
        </p>
        <p><strong>Us:</strong> {{ redScore }}</p>
        <p><strong>Them:</strong> {{ blueScore }}</p>
      </div>
      <div v-if="mode === 'Bidding'" class="my-4">
        <strong>Bid</strong>
        <button
          class="btn btn-blue"
          :disabled="blockBidding"
          @click="bid(active, -1)"
        >
          Pass
        </button>
        <button
          class="btn btn-blue"
          :disabled="maxBid[0] >= 2 || blockBidding"
          @click="bid(active, 2)"
        >
          2
        </button>
        <button
          class="btn btn-blue"
          :disabled="maxBid[0] >= 3 || blockBidding"
          @click="bid(active, 3)"
        >
          3
        </button>
        <button
          class="btn btn-blue"
          :disabled="maxBid[0] >= 4 || blockBidding"
          @click="bid(active, 4)"
        >
          4
        </button>
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
import { computed, defineComponent } from 'vue';
import {
  ConnectionMode,
  useConnectionsStore,
  DefaultGame,
} from '@/store/connections';
import { useGameStore } from '@/store/game';
import wait from '@/store/waiter';
import { Emojis, getPerfectDeck, isRed, shuffle } from '~/CardTypes';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const url = new URL(location.toString());
    const params = new URLSearchParams(url.search);
    const debug = params.get('debug') === 'true';
    const solo = params.get('solo') === 'true';

    const connections = useConnectionsStore();
    const { localId, mode: connectionMode } = storeToRefs(connections);
    const { host, join } = connections;

    // @ts-ignore
    window.connections = connections;

    const store = useGameStore();
    const { players, mode, ready, active, trump, redScore, blueScore, maxBid } =
      storeToRefs(store);
    const { bid, play, next, start } = store;

    const red = computed(() => isRed(trump.value));
    const emoji = computed(() => Emojis[trump.value]);
    const blockBidding = computed(() => !debug && active.value !== 0);

    wait(store);

    let dealer: number = Math.floor(Math.random() * 4);
    function deal() {
      if (connectionMode.value !== ConnectionMode.Host && !debug) {
        throw new Error('Not host');
      }

      dealer++;
      const deck = shuffle(getPerfectDeck());
      start(0, dealer % 4, deck);
    }

    if (solo) {
      deal();
    }

    // @ts-ignore
    window.game = store;

    return {
      debug,
      DefaultGame,
      connectionMode,
      localId,
      host,
      join,
      players,
      mode,
      ready,
      active,
      red,
      emoji,
      trump,
      redScore,
      blueScore,
      maxBid,
      blockBidding,
      deal,
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
