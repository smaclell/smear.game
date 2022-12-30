<template>
  <div>
    <div
      class="flex flex-row flex-wrap gap-2 md:gap-4 justify-center items-center"
    >
      <template v-for="card in props.cards">
        <PlayedCard
          v-if="card !== props.played"
          :key="card.suit + card.value.toString()"
          class="flex-grow flex-shrink-0 content-center"
          :card="card"
          :allowed="isAllowed(card)"
          :trump="!!trump && card.suit === trump"
          :hide="hide"
          @click="active && emit('click', props.id, card)"
        />
      </template>
    </div>
    <p
      :class="[
        'text-xl md:text-3xl lg:text-6xl',
        'text-center',
        { 'font-bold': active },
      ]"
    >
      {{ name }}
      <span v-if="bid">
        {{ bid }}
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/store/game';
import { Suit, CardValue } from '~/CardTypes';

type Card = { suit: Suit; value: CardValue };

type Props = {
  id: number;
  bid: number;
  active: boolean;
  name: String;
  cards: Card[];
  played: Card;
  hide: boolean;
};

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'click', playerId: number, card: Card): void;
}>();

const store = useGameStore();
const { trump, started, players } = storeToRefs(store);

const starter = computed(() => players.value[started.value]);
const firstPlayed = computed<Card | null>(() => {
  const firstPlayed = starter.value?.played;
  if (!firstPlayed) {
    return null;
  }

  return firstPlayed.suit !== Suit.Invalid ? firstPlayed : null;
});

const isRecommended = computed(() => {
  return (card: Card): boolean =>
    !firstPlayed.value ||
    card.suit === trump.value ||
    firstPlayed.value.suit === card.suit;
});

const isRequired = computed(() => {
  return (card: Card): boolean =>
    !!firstPlayed.value && firstPlayed.value.suit === card.suit;
});

const isAllowed = computed(() => {
  const hasRequired = players.value[props.id].cards.some(isRequired.value);
  return hasRequired ? isRecommended.value : (card: Card) => !!card;
});
</script>
