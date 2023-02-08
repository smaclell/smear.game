<template>
  <div class="text-2xl">
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
import { useGameStore } from '@/store/game';
import { useScoreStore } from '@/store/score';
import { Emojis, isRed } from '~/CardTypes';

const game = useGameStore();
const { trump } = storeToRefs(game);

const scores = useScoreStore();
const { red: redScore, blue: blueScore } = storeToRefs(scores);

const red = computed(() => isRed(trump.value));
const emoji = computed(() => Emojis[trump.value]);
</script>
