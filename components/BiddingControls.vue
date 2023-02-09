<template>
  <div>
    <div class="text-center py-4">
      <strong v-if="show">Your turn to Bid</strong>
      <strong v-else-if="best > 0">{{ winner }} bid {{ best }}</strong>
      <strong v-else>Still waiting for that first bid ...</strong>
    </div>
    <div v-if="show" class="text-center py-4">
      <button
        class="btn btn-blue"
        :disabled="best >= 2 || blocked"
        @click="bid(active, 2)"
      >
        2
      </button>
      <button
        class="btn btn-blue"
        :disabled="best >= 3 || blocked"
        @click="bid(active, 3)"
      >
        3
      </button>
      <button
        class="btn btn-blue"
        :disabled="best >= 4 || blocked"
        @click="bid(active, 4)"
      >
        4
      </button>
    </div>
    <div v-if="show" class="text-center py-4">
      <button class="btn btn-blue" :disabled="blocked" @click="bid(active, -1)">
        Pass
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/store/game';
import { getDebugSettings } from '@/store/debug';

const { debug } = getDebugSettings();

const store = useGameStore();
const { active, ready, players, maxBid } = storeToRefs(store);
const { bid } = store;

const show = computed(() => debug || active.value === 0);
const blocked = computed(() => !debug && !ready.value && !show.value);
const best = computed(() => maxBid.value[0]);
const winner = computed(() => {
  const max = maxBid.value[1];
  if (best.value <= 0 || max < 0 || max >= players.value.length) {
    return null;
  }

  return players.value[max].name;
});
</script>
