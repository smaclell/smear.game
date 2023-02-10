<template>
  <div class="grid grid-cols-3 grid-rows-2 gap-8 place-items-center">
    <PlayedCard
      v-if="left && left !== sentinel"
      class="col-start-1 row-start-1 row-end-3 left"
      :card="left"
      :trump="trump"
    />
    <PlayedCard
      v-if="top && top !== sentinel"
      class="col-start-2 top"
      :card="top"
      :trump="trump"
    />
    <PlayedCard
      v-if="right && right !== sentinel"
      class="col-start-3 row-start-1 row-end-3 right"
      :card="right"
      :trump="trump"
    />
    <PlayedCard
      v-if="bottom && bottom !== sentinel"
      class="col-start-2 row-end-3 bottom"
      :card="bottom"
      :trump="trump"
    />
  </div>
</template>

<script setup lang="ts">
import { Card, Suit, Sentinel } from '~/CardTypes';

type Props = {
  trump: Suit;
  left?: Card;
  top?: Card;
  right?: Card;
  bottom?: Card;
};

defineProps<Props>();
const sentinel = Sentinel;
</script>

<style lang="postcss" scoped>
.left,
.right {
  align-self: center;
}

.top {
  align-self: self-start;
}

.bottom {
  align-self: self-end;
}
</style>
