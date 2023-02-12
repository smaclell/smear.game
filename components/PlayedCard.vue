<template>
  <BaseCard
    :class="[
      'flex',
      'flex-col',
      'justify-between',
      {
        'bg-amber-50': highlight,
        'bg-white': !highlight,
        'text-red-500': red,
        'text-black': !red,
      },
    ]"
    :disabled="!allowed"
    @click="allowed && emit('click', card)"
  >
    <div class="pl-1 pt-1 justify-start self-start">
      <p>{{ label }}</p>
      <p>{{ icon }}</p>
    </div>
    <div class="pr-1 pb-1 justify-end self-end">
      <p class="rotate-180">{{ icon }}</p>
      <p class="rotate-180">{{ label }}</p>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Card, Suit, Emojis, isRed, isTrump } from '../CardTypes';

interface Props {
  card: Card;
  allowed?: boolean;
  trump: Suit;
}

const props = withDefaults(defineProps<Props>(), {
  allowed: true,
  trump: Suit.Invalid,
});

const lookup = [
  'invalid',
  'invalid',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];

const card = computed<Card>(() => props.card);
const trump = computed<Suit>(() => props.trump);
const red = computed(() => isRed(card.value.suit));
const highlight = computed(() => isTrump(trump.value, card.value));
const icon = computed(() => Emojis[card.value.suit]);
const label = computed(() => lookup[card.value.value]);

const emit = defineEmits<{
  (e: 'click', card: Card): void;
}>();
</script>

<style lang="postcss" scoped>
[disabled] > * {
  @apply opacity-50;
}

.long-name {
  display: none;
}

@media (min-width: 640px) {
  .long-name {
    display: inline;
  }
}
</style>
