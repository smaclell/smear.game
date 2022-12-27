<template>
  <div>
    <div class="flex flex-row flex-wrap gap-4 justify-center items-center">
      <template v-for="card in props.cards">
        <PlayedCard
          :key="card.suit + card.value.toString()"
          class="flex-grow flex-shrink-0 content-center"
          :card="card"
        />
      </template>
    </div>
    <p :class="['text-6xl', 'text-center', { 'font-bold': active }]">
      {{ name }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Suit, CardValue } from '../CardTypes';

type Card = { suit: Suit; value: CardValue };

type Props = {
  active: Boolean;
  name: String;
  cards: Card[];
};

const props = defineProps<Props>();
</script>
