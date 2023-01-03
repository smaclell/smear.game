<template>
  <p
    :class="[
      'text-xl md:text-3xl lg:text-6xl p-2 md:p-4',
      'text-center',
      { 'font-bold': highlight },
    ]"
  >
    <span v-if="highlight"> ⏰ </span>
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
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useGameStore } from '@/store/game';
import { PlayerIndex } from '@/store/Player';

type Props = {
  id: PlayerIndex;
  bid: number;
  name: String;
};

const store = useGameStore();
const { active } = storeToRefs(store);

const props = defineProps<Props>();
const highlight = computed(() => active.value === props.id);
</script>
