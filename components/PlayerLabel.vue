<template>
  <p
    :class="[
      'text-xl md:text-3xl lg:text-6xl',
      'text-center',
      { 'font-bold': active },
    ]"
  >
    <span v-if="active"> ⏰ </span>
    <span>
      {{ name }}
    </span>
    <span v-if="bid > 0">
      {{ bid }}
    </span>
    <span v-else-if="bid < 0"> pass </span>
  </p>
</template>

<script setup lang="ts">
type Props = {
  bid: number;
  active: boolean;
  name: String;
};

defineProps<Props>();
</script>
