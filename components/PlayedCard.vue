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
      { flip: false, 'text-red-500': red, 'text-black': !red },
    ]"
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
import { Suit, CardValue } from '../CardTypes';

type Props = { suit: Suit; value: CardValue };

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
const red = props.suit === Suit.Hearts || props.suit === Suit.Diamonds;
const icon = suits[props.suit];
const label = lookup[props.value];
</script>

<style lang="postcss" scoped>
.card {
  box-sizing: content-box;
  min-width: 81px;
  max-width: 120px;
  aspect-ratio: 9 / 16;
}
</style>
