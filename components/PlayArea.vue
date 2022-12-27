<template>
  <div class="grid grid-cols-3 grid-rows-2 gap-8 place-items-center">
    <PlayedCard
      v-if="props.left"
      class="col-start-1 row-start-1 row-end-3 left"
      v-bind="props.left"
    />
    <PlayedCard v-if="props.top" class="col-start-2 top" v-bind="props.top" />
    <PlayedCard
      v-if="props.right"
      class="col-start-3 row-start-1 row-end-3 right"
      v-bind="props.right"
    />
    <PlayedCard
      v-if="props.bottom"
      class="col-start-2 bottom"
      v-bind="props.bottom"
    />
  </div>
</template>

<script setup lang="ts">
import { Card } from '../CardTypes';

type Props = {
  left?: Card;
  top?: Card;
  right?: Card;
  bottom?: Card;
};

const props = defineProps<Props>();
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
