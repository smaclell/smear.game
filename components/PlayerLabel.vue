<template>
  <p :class="['text-sm p-4 text-center', { 'font-bold': highlight }]">
    <span v-if="active === id"> ⏰ </span>
    <span class="text-lg">
      {{ name }}
    </span>
    <span v-if="bid > 0">
      {{ bid }}
    </span>
    <span v-else-if="bid < 0" class="text-gray-500"> pass </span>
  </p>
</template>

<script setup lang="ts">
import { PlayerIndex } from '@/store/Player';

type Props = {
  active: number;
  id: PlayerIndex;
  bid: number;
  name: String;
};

defineProps<Props>();
</script>
