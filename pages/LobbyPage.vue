<template>
  <div class="text-2xl">
    <div v-if="mode === 'Lobby'" class="my-4">
      <strong>Connection:</strong>
      <button class="btn btn-blue" @click="host(DefaultGame)">Host</button>
      <button class="btn btn-blue" @click="join(DefaultGame)">Join</button>
    </div>
    <div v-else-if="mode === 'Host'" class="my-4">
      <StartButton />
    </div>
    <div v-else-if="mode === 'Player'" class="my-4">Waiting for the host!</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useConnectionsStore, DefaultGame } from '@/store/connections';

export default defineComponent({
  name: 'LobbyPage',
  setup() {
    const connections = useConnectionsStore();
    const { mode } = storeToRefs(connections);
    const { host, join } = connections;

    return {
      DefaultGame,
      mode,
      host,
      join,
    };
  },
});
</script>
