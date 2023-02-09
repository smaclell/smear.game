<template>
  <div class="text-lg">
    <strong v-if="player.name !== ''">{{ player.name }}</strong>
    <button v-else-if="allow" class="btn btn-blue" @click="request(player.id)">
      Pick
    </button>
    <em v-else class="text-gray-500">waiting</em>
  </div>
</template>

<script setup lang="ts">
import { Player, PlayerIndex } from '~/store/Player';

type Props = {
  player: Player;
  request: (id: PlayerIndex) => void;
  allow: boolean;
};

defineProps<Props>();
</script>
