<template>
  <div
    class="text-sm text-black border-2 border-black border-solid rounded bg-white w-fit h-fit"
  >
    <div class="p-0.5 text-xl">
      <button
        :class="['sound', sound ? 'on' : 'off']"
        :title="`click to turn sound ${sound ? 'off' : 'on'}`"
        @click="$emit('update:sound', !sound)"
      >
        {{ sound ? '🔊' : '🔇' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  sound: boolean;
};

defineProps<Props>();

// TODO: This will need to be updated for Vue 3
defineEmits<{
  (e: 'update:sound', value: boolean): void;
}>();
</script>

<style lang="postcss" scoped>
.sound {
  transition: transform 0.2s ease;
}

.sound:hover {
  transform: scale(1.1);
  opacity: 1;
}

.off {
  opacity: 0.5;
}

.on {
  opacity: 1;
}
</style>
