<template>
  <div
    :class="[
      'card',
      'border-2',
      'border-black',
      'border-solid',
      'rounded',
      'text-center',
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
  @apply text-xs;

  /*
  Warning:
  This does not work as well when it is responsive using min-* and max-*.
  See https://css-tricks.com/almanac/properties/a/aspect-ratio/
  */
  width: 42px;
  aspect-ratio: 2.25 / 3.5;
  box-sizing: content-box;
}

/*
.play-area /deep/ .card {
  @apply text-sm;
}
*/

@media (min-width: 480px) {
  .card {
    @apply text-sm;

    width: 54px;
  }
}

@media (min-width: 640px) {
  .card {
    @apply text-base;

    width: 72px;
  }
}
</style>
