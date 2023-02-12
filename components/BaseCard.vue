<template>
  <div
    :class="[
      'card',
      'p-1',
      'border-2',
      'border-black',
      'border-solid',
      'rounded',
      'font-serif',
      disabled ? 'shadow-sm cursor-not-allowed' : 'cursor-grab shadow-md',
      'hover:shadow-xl',
    ]"
    :disabled="disabled"
    @click="!disabled && emit('click')"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ disabled: boolean }>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>

<style lang="postcss" scoped>
.card {
  @apply text-sm;

  box-sizing: content-box;
  min-width: 32px;
  max-width: 36px;
  aspect-ratio: 2.5 / 3.5;
}

@media (min-width: 540px) {
  .card {
    @apply text-lg;

    min-width: 42px;
    max-width: 64px;
  }
}
</style>
