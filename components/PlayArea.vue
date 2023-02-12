<template>
  <div class="grid grid-cols-3 grid-rows-2 gap-4 place-items-center">
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
.right,
.top,
.bottom {
  z-index: 100;
  align-self: center;
}

.left {
  animation: 0.3s ease 0s left-in;
  transform: rotate(8deg);
}

@keyframes left-in {
  0% {
    transform: translate(-200%, 0);
  }

  60% {
    transform: translate(-50%, 2%);
  }

  100% {
    transform: translate(0, 0) rotate(8deg);
  }
}

.right {
  animation: 0.3s ease 0s right-in;
  transform: rotate(-8deg);
}

@keyframes right-in {
  0% {
    transform: translate(200%, 0);
  }

  60% {
    transform: translate(50%, 2%);
  }

  100% {
    transform: translate(0, 0) rotate(-8deg);
  }
}

.top {
  animation: 0.3s ease 0s top-in;
  transform: rotate(-8deg);
}

@keyframes top-in {
  0% {
    transform: translate(0, -200%);
  }

  60% {
    transform: translate(2%, -50%);
  }

  100% {
    transform: translate(0, 0) rotate(-8deg);
  }
}

.bottom {
  animation: 0.3s ease 0s bottom-in;
  transform: rotate(8deg);
}

@keyframes bottom-in {
  0% {
    transform: translate(0, 200%);
  }

  60% {
    transform: translate(-2%, 50%);
  }

  100% {
    transform: translate(0, 0) rotate(8deg);
  }
}
</style>
