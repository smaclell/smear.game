<template>
  <div class="text-2xl">
    <div v-if="connectionMode === 'Lobby'" class="my-4">
      <strong>Connection:</strong>
      <button class="btn btn-blue" @click="host(DefaultGame)">Host</button>
      <button class="btn btn-blue" @click="join(DefaultGame)">Join</button>
    </div>
    <div v-if="debug || connectionMode === 'Host'" class="my-4">
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
        <span :class="[red ? 'text-red-500' : 'text-black']">{{ emoji }}</span>
      </p>
      <p><strong>Us:</strong> {{ redScore }}</p>
      <p><strong>Them:</strong> {{ blueScore }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import {
  ConnectionMode,
  useConnectionsStore,
  DefaultGame,
} from '@/store/connections';
import { useGameStore } from '@/store/game';
import { getDebugSettings } from '@/store/debug';
import { Emojis, getPerfectDeck, isRed, shuffle } from '~/CardTypes';

const { debug, solo } = getDebugSettings();

const connections = useConnectionsStore();
const { mode: connectionMode } = storeToRefs(connections);
const { host, join } = connections;

const store = useGameStore();
const { mode, ready, trump, redScore, blueScore } = storeToRefs(store);
const { next, start } = store;

const red = computed(() => isRed(trump.value));
const emoji = computed(() => Emojis[trump.value]);

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
</script>
