<template>
  <button class="btn btn-blue" @click="deal">Start</button>
</template>

<script setup lang="ts">
import { useGameStore } from '@/store/game';

const game = useGameStore();
const { deal } = game;
</script>
