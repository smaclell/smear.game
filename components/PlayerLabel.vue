<template>
  <p
    :class="[
      'text-xs p-2 text-center whitespace-nowrap',
      { 'font-bold': active === id },
    ]"
  >
    <span v-if="active === id"> ⏰ </span>
    <span class="text-sm">
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
