<template>
  <div class="p-4">
    <template v-if="isDone">
      <p v-if="redScore > blueScore" class="text-2xl p-2 winning">You won!</p>
      <p v-else class="text-2xl p-2 losing">You lost!</p>
    </template>
    <template v-else>
      <p v-if="redScore > blueScore" class="text-2xl p-2 winning">
        Oh ya! You are winning!
      </p>
      <p v-else-if="blueScore > redScore" class="text-2xl p-2 losing">
        Keep going! You are behind!
      </p>
      <p v-else class="text-2xl p-2 tied">How did this happen? You are tied!</p>
    </template>

    <div class="text-xl p-2">
      <p><strong>Us:</strong> {{ redScore }}</p>
      <p><strong>Them:</strong> {{ blueScore }}</p>
    </div>

    <div
      v-for="score in scores"
      :key="score.id"
      class="text-xl p-2 m-2 shadow shadow-sm border-2 border-black border-solid rounded"
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
      <p v-if="score.lowest">Won Low</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { Mode, useGameStore } from '@/store/game';

const store = useGameStore();
const { mode, players, scores, redScore, blueScore } = storeToRefs(store);

const isDone = computed(() => mode.value === Mode.Game);
</script>
