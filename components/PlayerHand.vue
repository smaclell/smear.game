<template>
  <div
    class="flex justify-center items-center flex-row"
    :data-length="player.cards.length"
  >
    <template v-for="(card, i) in player.cards">
      <PlayedCard
        :key="card.suit + card.value.toString()"
        class="card flex-shrink-0 content-center"
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
.card {
  --diff: calc(var(--mid) - var(--pos));
  --shift: 0%;
  --offset: 0%;

  z-index: calc(10 * var(--pos) + 10);
  transition: transform 0.2s ease-in;
  transform: translate(calc(100% * var(--diff)), 0%)
    rotate(calc(-4deg * var(--diff)))
    translate(calc(-80% * var(--diff)), calc(-1 * var(--shift) - var(--offset)));
}

.card:hover {
  --offset: 10%;
}

[data-position='0'] {
  --pos: 0;
}

[data-position='1'] {
  --pos: 1;
}

[data-position='2'] {
  --pos: 2;
}

[data-position='3'] {
  --pos: 3;
}

[data-position='4'] {
  --pos: 4;
}

[data-position='5'] {
  --pos: 5;
}

[data-length='0'],
[data-length='1'] {
  --mid: 0;
}

[data-length='2'] {
  --mid: 0.5;
}

[data-length='3'] {
  --mid: 1;
}

[data-length='4'] {
  --mid: 1.5;
}

[data-length='5'] {
  --mid: 2;
}

[data-length='6'] {
  --mid: 2.5;
}
</style>
