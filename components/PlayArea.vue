<template>
  <div class="grid grid-cols-3 grid-rows-2 gap-8 place-items-center">
    <PlayedCard
      v-if="props.left && props.left !== sentinel"
      class="col-start-1 row-start-1 row-end-3 left"
      :card="props.left"
      :trump="isTrump(trump, props.left)"
      :hide="false"
      allowed
    />
    <PlayedCard
      v-if="props.top && props.top !== sentinel"
      class="col-start-2 top"
      :card="props.top"
      :trump="isTrump(trump, props.top)"
      :hide="false"
      allowed
    />
    <PlayedCard
      v-if="props.right && props.right !== sentinel"
      class="col-start-3 row-start-1 row-end-3 right"
      :card="props.right"
      :trump="isTrump(trump, props.right)"
      :hide="false"
      allowed
    />
    <PlayedCard
      v-if="props.bottom && props.bottom !== sentinel"
      class="col-start-2 row-end-3 bottom"
      :card="props.bottom"
      :trump="isTrump(trump, props.bottom)"
      :hide="false"
      allowed
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGameStore } from '~/store/game';
import { Card, isTrump, Sentinel } from '~/CardTypes';

type Props = {
  left?: Card;
  top?: Card;
  right?: Card;
  bottom?: Card;
};

const props = defineProps<Props>();
const sentinel = Sentinel;

const store = useGameStore();
const { trump } = storeToRefs(store);
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
