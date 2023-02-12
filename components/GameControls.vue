<template>
  <div
    v-if="trump !== 'Invalid'"
    class="text-sm text-black border-2 border-black border-solid rounded bg-white w-fit h-fit"
  >
    <div class="p-0.5">
      <p>
        <span :class="[isRed(trump) ? 'text-red-500' : 'text-black']">{{
          Emojis[trump]
        }}</span>
        <span>{{ trump }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Emojis, isRed, Suit } from '~/CardTypes';

type Props = {
  trump: Suit;
};

defineProps<Props>();
</script>
