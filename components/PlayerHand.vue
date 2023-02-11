<template>
  <div
    class="flex gap-2 md:gap-4 justify-center items-center flex-row"
    :data-length="player.cards.length"
  >
    <template v-for="(card, i) in player.cards">
      <PlayedCard
        :key="card.suit + card.value.toString()"
        class="flex-grow flex-shrink-0 content-center"
        :data-position="i"
        :card="card"
        :allowed="isAllowed(trump, led, player.cards, card)"
        :trump="trump"
        @click="play(player.id, card)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { PlayerIndex } from '~/store/Player';
import { Suit, Card } from '~/CardTypes';
import { isAllowed } from '~/PlayableHelpers';

interface Props {
  play: (id: PlayerIndex, card: Card) => void;
  trump: Suit;
  led: Card | null;
  player: {
    id: PlayerIndex;
    cards: Card[];
  };
}

defineProps<Props>();
</script>

<style lang="postcss" scoped>
/* [data-length='2'] */
[data-length='2'] [data-position='0'] {
  transform: rotate(-4deg);
}

[data-length='2'] [data-position='1'] {
  transform: rotate(4deg);
}

/* [data-length='3'] */
[data-length='3'] [data-position='0'] {
  transform: rotate(-4deg);
}

[data-length='3'] [data-position='1'] {
  transform: translateY(-4px);
}

[data-length='3'] [data-position='2'] {
  transform: rotate(4deg);
}

/* [data-length='4'] */
[data-length='4'] [data-position='0'] {
  transform: rotate(-4deg);
}

[data-length='4'] [data-position='1'] {
  transform: rotate(-2deg) translateY(-4px);
}

[data-length='4'] [data-position='2'] {
  transform: rotate(2deg) translateY(-4px);
}

[data-length='4'] [data-position='3'] {
  transform: rotate(4deg);
}

/* [data-length='5'] */
[data-length='5'] [data-position='0'] {
  transform: rotate(-8deg) translateY(8px);
}

[data-length='5'] [data-position='1'] {
  transform: rotate(-4deg);
}

[data-length='5'] [data-position='2'] {
  transform: translateY(-2px);
}

[data-length='5'] [data-position='3'] {
  transform: rotate(4deg);
}

[data-length='5'] [data-position='4'] {
  transform: rotate(8deg) translateY(8px);
}

/* [data-length='6'] */
[data-length='6'] [data-position='0'] {
  transform: rotate(-16deg) translateY(12px);
}

[data-length='6'] [data-position='1'] {
  transform: rotate(-8deg);
}

[data-length='6'] [data-position='2'] {
  transform: rotate(-2deg) translateY(-6px);
}

[data-length='6'] [data-position='3'] {
  transform: rotate(2deg) translateY(-6px);
}

[data-length='6'] [data-position='4'] {
  transform: rotate(8deg);
}

[data-length='6'] [data-position='5'] {
  transform: rotate(16deg) translateY(12px);
}
</style>
