<template>
  <div>
    <div class="flex flex-row flex-wrap gap-4 justify-center items-center">
      <template v-for="card in props.cards">
        <PlayedCard
          v-if="card !== props.played"
          :key="card.suit + card.value.toString()"
          class="flex-grow flex-shrink-0 content-center"
          :card="card"
          :allowed="isAllowed(card)"
          :trump="!!trump && card.suit === trump"
          @click="active && emit('click', props.id, card)"
        />
      </template>
    </div>
    <p :class="['text-6xl', 'text-center', { 'font-bold': active }]">
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
  active: Boolean;
  name: String;
  cards: Card[];
  played: Card;
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

// TODO: Separate required from allowed
const isRecommended = computed(() => {
  return (card: Card): boolean =>
    !firstPlayed.value ||
    card.suit === trump.value ||
    firstPlayed.value.suit === card.suit;
});

const isAllowed = computed(() => {
  const canRecommend = players.value[props.id].cards.some(isRecommended.value);
  return canRecommend ? isRecommended.value : (card: Card) => !!card;
});
</script>
