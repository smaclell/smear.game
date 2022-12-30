<template>
  <div
    :class="[
      'card',
      'flex',
      'flex-col',
      'justify-between',
      'p-1',
      'lg:p-3',
      'text-lg',
      'lg:text-4xl',
      'border-2',
      'border-black',
      'border-solid',
      'rounded',
      'shadow',
      hide
        ? 'bg-slate-500'
        : !allowed
        ? 'shadow-sm opacity-50 cursor-not-allowed'
        : ['cursor-grab', { 'shadow-md': !trump, 'shadow-lg': trump }],
      'hover:shadow-xl',
      {
        flip: false,
        hidden,
        'bg-amber-50': trump,
        'text-red-500': red,
        'text-black': !red,
      },
    ]"
    :disabled="!hide && !allowed"
    @click="!hide && allowed && emit('click', card)"
  >
    <template v-if="!hide">
      <div class="justify-start self-start">
        <span>{{ icon }}</span>
      </div>
      <div class="flex-auto flex items-center justify-center">
        <template v-if="/\d+/.test(label)">
          <span>{{ label }}</span>
        </template>
        <template v-else>
          <span>{{ label[0] }}</span>
          <span class="long-name">{{ label.substring(1) }}</span>
        </template>
      </div>
      <div class="justify-end self-end">
        <span>{{ icon }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Suit, Card, Emojis, isRed } from '../CardTypes';

type Props = { card: Card; allowed: boolean; trump: boolean; hide: boolean };

const props = defineProps<Props>();

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
const red = computed(() => isRed(card.value.suit));
const icon = computed(() => Emojis[card.value.suit]);
const label = computed(() => lookup[card.value.value]);

const hidden = computed(() => card.value.suit === Suit.Invalid);

const emit = defineEmits<{
  (e: 'click', card: Card): void;
}>();
</script>

<style lang="postcss" scoped>
.card {
  box-sizing: content-box;
  min-width: 9px;
  max-width: 27px;
  aspect-ratio: 2 / 3;
}

.long-name {
  display: none;
}

@media (min-width: 640px) {
  .card {
    min-width: 54px;
    max-width: 120px;
    aspect-ratio: 9 / 16;
  }

  .long-name {
    display: inline;
  }
}
</style>
