<template>
  <div
    :class="[
      'container flex gap-2 md:gap-4 justify-center items-center',
      position,
      vertical ? 'flex-col' : 'flex-row',
      vertical ? 'rotate' : 'straight',
    ]"
    :data-length="player.cards.length"
  >
    <template v-for="card in player.cards">
      <HiddenCard
        :key="card.suit + card.value.toString()"
        :class="[
          'hidden-card flex-grow flex-shrink-0 content-center',
          position,
        ]"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Card } from '~/CardTypes';

interface Props {
  player: {
    cards: Card[];
  };
  position: 'top' | 'left' | 'right' | 'bottom';
}

const props = defineProps<Props>();

const vertical = computed(
  () => props.position === 'left' || props.position === 'right'
);
</script>

<style lang="postcss" scoped>
.rotate .hidden-card {
  margin: -24px 4px;
}

.straight .hidden-card {
  margin: 4px -30px;
}

.rotate {
  max-width: 120px;
  max-height: 240px;
}

.rotate.container {
  padding: 24px 0;
}

.straight.container {
  padding: 0 24px;
}

.hidden-card.top {
  transform: rotate(180deg);
}

.hidden-card.left {
  transform: rotate(90deg);
}

.hidden-card.right {
  transform: rotate(-90deg);
}
</style>
