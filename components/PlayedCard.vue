<template>
  <div
    :class="[
      'card',
      'flex',
      'flex-col',
      'justify-between',
      'p-3',
      'text-3xl',
      'border-2',
      'border-black',
      'border-solid',
      'rounded',
      !allowed
        ? 'shadow opacity-50 cursor-not-allowed'
        : ['cursor-grab', { 'shadow-md': !trump, 'shadow-lg': trump }],
      {
        flip: false,
        'bg-amber-100': trump,
        'text-red-500': red,
        'text-black': !red,
      },
    ]"
    :disabled="!allowed"
    @click="allowed && emit('click', card)"
  >
    <div class="justify-start self-start">
      <span>{{ label }}</span> <span>{{ icon }}</span>
    </div>
    <div class="flex-auto" />
    <div class="justify-end self-end">
      <span>{{ label }}</span> <span>{{ icon }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Suit, Card } from '../CardTypes';

type Props = { card: Card; allowed: boolean; trump: boolean };

const props = defineProps<Props>();

const suits = {
  [Suit.Hearts]: '♥️',
  [Suit.Diamonds]: '♦️',
  [Suit.Spades]: '♠️',
  [Suit.Clubs]: '♣️',
};
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
  'Jack',
  'Queen',
  'King',
  'Ace',
];

const card = computed<Card>(() => props.card);
const red = computed(
  () => card.value.suit === Suit.Hearts || card.value.suit === Suit.Diamonds
);
const icon = computed(() => suits[card.value.suit]);
const label = computed(() => lookup[card.value.value]);

const emit = defineEmits<{
  (e: 'click', card: Card): void;
}>();
</script>

<style lang="postcss" scoped>
.card {
  box-sizing: content-box;
  min-width: 81px;
  max-width: 120px;
  aspect-ratio: 9 / 16;
}
</style>
