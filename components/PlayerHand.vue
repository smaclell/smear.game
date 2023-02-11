<template>
  <div
    :class="[
      'flex gap-2 md:gap-4 justify-center items-center',
      position,
      vertical ? 'flex-col' : 'flex-row',
      position === 'bottom' && 'rotate',
    ]"
    :data-length="props.cards.length"
  >
    <template v-for="(card, i) in props.cards">
      <PlayedCard
        :key="card.suit + card.value.toString()"
        class="flex-grow flex-shrink-0 content-center"
        :data-position="i"
        :card="card"
        :allowed="isAllowed(card)"
        :trump="trump"
        @click="play(props.id, card)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/store/game';
import { Suit, CardValue, isJick, isTrump } from '~/CardTypes';

type Card = { suit: Suit; value: CardValue };

type Props = {
  id: number;
  bid: number;
  name: String;
  cards: Card[];
  played: Card;
  position: 'top' | 'left' | 'right' | 'bottom';
};

const props = defineProps<Props>();

const store = useGameStore();
const { trump, started, players } = storeToRefs(store);
const { play } = store;

const vertical = computed(
  () => props.position === 'left' || props.position === 'right'
);

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
    isTrump(trump.value, card) ||
    (firstPlayed.value.suit === card.suit &&
      !(isJick(trump.value, firstPlayed.value) || isJick(trump.value, card)));
});

const isRequired = computed(() => {
  return (card: Card): boolean =>
    !!firstPlayed.value &&
    ((isTrump(trump.value, firstPlayed.value) && isTrump(trump.value, card)) ||
      (firstPlayed.value.suit === card.suit &&
        !(
          isJick(trump.value, firstPlayed.value) || isJick(trump.value, card)
        )));
});

const isAllowed = computed(() => {
  const hasRequired = players.value[props.id].cards.some(isRequired.value);
  return hasRequired ? isRecommended.value : (card: Card) => !!card;
});
</script>

<style lang="postcss" scoped>
.top {
  /* transform: rotate(180deg); */
}

.left {
  /* transform: rotate(90deg); */
}

.right {
  /* transform: rotate(-90deg); */
}

/* [data-length='2'] */
[data-length='2'].rotate [data-position='0'] {
  transform: rotate(-4deg);
}

[data-length='2'].rotate [data-position='1'] {
  transform: rotate(4deg);
}

/* [data-length='3'] */
[data-length='3'].rotate [data-position='0'] {
  transform: rotate(-4deg);
}

[data-length='3'].rotate [data-position='1'] {
  transform: translateY(-4px);
}

[data-length='3'].rotate [data-position='2'] {
  transform: rotate(4deg);
}

/* [data-length='4'] */
[data-length='4'].rotate [data-position='0'] {
  transform: rotate(-4deg);
}

[data-length='4'].rotate [data-position='1'] {
  transform: rotate(-2deg) translateY(-4px);
}

[data-length='4'].rotate [data-position='2'] {
  transform: rotate(2deg) translateY(-4px);
}

[data-length='4'].rotate [data-position='3'] {
  transform: rotate(4deg);
}

/* [data-length='5'] */
[data-length='5'].rotate [data-position='0'] {
  transform: rotate(-8deg) translateY(8px);
}

[data-length='5'].rotate [data-position='1'] {
  transform: rotate(-4deg);
}

[data-length='5'].rotate [data-position='2'] {
  transform: translateY(-2px);
}

[data-length='5'].rotate [data-position='3'] {
  transform: rotate(4deg);
}

[data-length='5'].rotate [data-position='4'] {
  transform: rotate(8deg) translateY(8px);
}

/* [data-length='6'] */
[data-length='6'].rotate [data-position='0'] {
  transform: rotate(-16deg) translateY(12px);
}

[data-length='6'].rotate [data-position='1'] {
  transform: rotate(-8deg);
}

[data-length='6'].rotate [data-position='2'] {
  transform: rotate(-2deg) translateY(-6px);
}

[data-length='6'].rotate [data-position='3'] {
  transform: rotate(2deg) translateY(-6px);
}

[data-length='6'].rotate [data-position='4'] {
  transform: rotate(8deg);
}

[data-length='6'].rotate [data-position='5'] {
  transform: rotate(16deg) translateY(12px);
}
</style>
