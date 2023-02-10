<template>
  <div class="text-2xl">
    <div class="my-4">
      <p><strong>Us:</strong> {{ redScore }}</p>
      <p><strong>Them:</strong> {{ blueScore }}</p>
      <p v-if="trump !== 'Invalid'">
        <strong>Trump:</strong> {{ trump }}
        <span :class="[isRed(trump) ? 'text-red-500' : 'text-black']">{{
          Emojis[trump]
        }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Emojis, isRed, Suit } from '~/CardTypes';

type Props = {
  trump: Suit;
  redScore: number;
  blueScore: number;
};

defineProps<Props>();
</script>
