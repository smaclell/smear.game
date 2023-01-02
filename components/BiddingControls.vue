<template>
  <div>
    <strong>Bid</strong>
    <button class="btn btn-blue" :disabled="blocked" @click="bid(active, -1)">
      Pass
    </button>
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/store/game';
import { getDebugSettings } from '@/store/debug';

const { debug } = getDebugSettings();

const store = useGameStore();
const { active, ready, maxBid } = storeToRefs(store);
const { bid } = store;

const blocked = computed(() => !debug && !ready.value && active.value !== 0);
const best = computed(() => maxBid.value[0]);
</script>
