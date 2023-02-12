<template>
  <div
    class="container flex gap-2 md:gap-4 justify-center items-center flex-row"
    :data-length="player.cards.length"
  >
    <template v-for="card in player.cards">
      <HiddenCard
        :key="card.suit + card.value.toString()"
        class="hidden-card flex-grow flex-shrink-0 content-center"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { Card } from '~/CardTypes';

interface Props {
  player: {
    cards: Card[];
  };
}

defineProps<Props>();
</script>

<style lang="postcss" scoped>
.hidden-card {
  margin: 4px -16px;
  transform: rotate(4deg);
}

.container {
  padding: 0 30px;
}
</style>
