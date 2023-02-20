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
  @apply text-xl;

  /*
  Warning:
  This does not work as well when it is responsive using min-* and max-*.
  See https://css-tricks.com/almanac/properties/a/aspect-ratio/
  */
  width: 54px;
  aspect-ratio: 2.25 / 3.5;
  box-sizing: content-box;
}

/*
.play-area /deep/ .card {
  @apply text-sm;
}
*/

@media (min-width: 450px) and (orientation: portrait),
  (min-height: 450px) and (orientation: landscape) {
  .card {
    @apply text-2xl;

    width: 72px;
  }
}

@media (min-width: 640px) and (orientation: portrait),
  (min-height: 640px) and (orientation: landscape) {
  .card {
    @apply text-4xl;

    width: 96px;
  }
}
</style>
