<template>
  <div
    :class="[
      'card',
      'p-1',
      'border-2',
      'border-black',
      'border-solid',
      'rounded',
      disabled
        ? 'shadow-sm opacity-50 cursor-not-allowed'
        : 'cursor-grab shadow-md',
      'hover:shadow-xl',
    ]"
    :disabled="disabled"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ disabled: boolean }>();
</script>

<style lang="postcss" scoped>
.card {
  @apply text-sm;

  box-sizing: content-box;
  min-width: 32px;
  max-width: 36px;
  aspect-ratio: 9 / 16;
}

@media (min-width: 540px) {
  .card {
    @apply text-lg;

    min-width: 42px;
    max-width: 64px;
  }
}
</style>
