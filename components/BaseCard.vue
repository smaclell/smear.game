<template>
  <div
    :class="[
      'card',
      'p-1',
      'text-lg',
      'lg:text-2xl',
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
  box-sizing: content-box;
  min-width: 9px;
  max-width: 27px;
  aspect-ratio: 9 / 16;
}

@media (min-width: 640px) {
  .card {
    min-width: 64px;
    max-width: 72px;
  }
}
</style>
