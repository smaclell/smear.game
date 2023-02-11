<template>
  <div class="text-sm">
    <div class="m-2">
      <p v-if="trump !== 'Invalid'" class="whitespace-nowrap">
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
