<template>
  <div class="text-2xl">
    <div v-if="mode === 'Lobby'">
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="username"
        >
          What is your name?
        </label>
        <input
          v-model.trim="name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="What is your name?"
        />
      </div>
      <div class="my-4">
        <strong>Connection:</strong>
        <button class="btn btn-blue" :disabled="name === ''" @click="host">
          Host
        </button>
        <button class="btn btn-blue" :disabled="name === ''" @click="join">
          Join
        </button>
      </div>
    </div>
    <div v-else>
      <div class="grid grid-cols-3 grid-rows-2 gap-8 place-items-center mb-4">
        <PlayerPlaceholder
          class="col-start-1 row-start-1 row-end-3 left"
          :player="players[3]"
          :request="request"
          :allow="mode === 'Player'"
        />
        <PlayerPlaceholder
          class="col-start-2 top"
          :player="players[0]"
          :request="request"
          :allow="mode === 'Player'"
        />
        <PlayerPlaceholder
          class="col-start-3 row-start-1 row-end-3 right"
          :player="players[1]"
          :request="request"
          :allow="mode === 'Player'"
        />
        <PlayerPlaceholder
          class="col-start-2 row-end-3 bottom"
          :player="players[2]"
          :request="request"
          :allow="mode === 'Player'"
        />
      </div>
      <div class="my-4">
        <StartButton v-if="mode === 'Host'" />
        <template v-else-if="mode === 'Player'">
          Waiting for the host!
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useConnectionsStore, DefaultGame } from '@/store/connections';
import { getDebugSettings } from '~/store/debug';
import { useGameStore } from '@/store/game';

export default defineComponent({
  name: 'LobbyScreen',
  setup() {
    const connections = useConnectionsStore();
    const { mode, name, localId } = storeToRefs(connections);
    const { host, join, request } = connections;

    const { name: defaultName } = getDebugSettings();
    if (defaultName) {
      name.value = defaultName;
    } else {
      const playerName = (localStorage.getItem('playerName') ?? '').trim();
      if (playerName !== '') {
        name.value = playerName;
      }
    }

    function saveName() {
      if (defaultName) {
        return;
      }

      localStorage.setItem('playerName', name.value);
    }

    const game = useGameStore();
    const { players } = storeToRefs(game);

    return {
      DefaultGame,
      mode,
      name,
      localId,
      players,
      host() {
        saveName();
        players.value[0].name = name.value;
        host(DefaultGame);
      },
      join() {
        saveName();
        join(DefaultGame);
      },
      request,
    };
  },
});
</script>

<style lang="postcss" scoped>
.left,
.right {
  align-self: center;
}

.top {
  align-self: self-start;
}

.bottom {
  align-self: self-end;
}
</style>
