<template>
  <div
    class="flex justify-center items-center flex-row"
    :data-length="player.cards.length"
  >
    <template v-for="(card, i) in player.cards">
      <PlayedCard
        :key="card.suit + card.value.toString()"
        class="card flex-grow flex-shrink-0 content-center"
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
  transition: transform 0.2s ease-in;
}

[data-position='0'] {
  z-index: 10;
}

[data-position='1'] {
  z-index: 20;
}

[data-position='2'] {
  z-index: 30;
}

[data-position='3'] {
  z-index: 40;
}

[data-position='4'] {
  z-index: 50;
}

[data-position='5'] {
  z-index: 60;
}

[data-position='6'] {
  z-index: 70;
}

/* [data-length='2'] */
[data-length='2'] [data-position='0'] {
  transform: translate(50%, 0) rotate(-4deg) translate(-25%, -5%);
}

[data-length='2'] [data-position='1'] {
  transform: translate(-50%, 0) rotate(4deg) translate(25%, -5%);
}

/* [data-length='3'] */
[data-length='3'] [data-position='0'] {
  transform: translate(100%, 0) rotate(-8deg) translate(-50%, -5%);
}

[data-length='3'] [data-position='1'] {
  transform: translate(0, -2.5%);
}

[data-length='3'] [data-position='2'] {
  transform: translate(-100%, 0) rotate(8deg) translate(50%, -5%);
}

/* [data-length='4'] */
[data-length='4'] [data-position='0'] {
  transform: translate(150%, 0) rotate(-12deg) translate(-75%, -10%);
}

[data-length='4'] [data-position='1'] {
  transform: translate(50%, 0) rotate(-4deg) translate(-25%, -5%);
}

[data-length='4'] [data-position='2'] {
  transform: translate(-50%, 0) rotate(4deg) translate(25%, -5%);
}

[data-length='4'] [data-position='3'] {
  transform: translate(-150%, 0) rotate(12deg) translate(75%, -10%);
}

/* [data-length='5'] */
[data-length='5'] [data-position='0'] {
  transform: translate(200%, 0) rotate(-16deg) translate(-100%, -10%);
}

[data-length='5'] [data-position='1'] {
  transform: translate(100%, 0) rotate(-8deg) translate(-50%, -5%);
}

[data-length='5'] [data-position='2'] {
  transform: translate(0, -2.5%);
}

[data-length='5'] [data-position='3'] {
  transform: translate(-100%, 0) rotate(8deg) translate(50%, -5%);
}

[data-length='5'] [data-position='4'] {
  transform: translate(-200%, 0) rotate(16deg) translate(100%, -10%);
}

/* [data-length='6'] */
[data-length='6'] [data-position='0'] {
  transform: translate(250%, 0%) rotate(-20deg) translate(-125%, -20%);
}

[data-length='6'] [data-position='1'] {
  transform: translate(150%, 0) rotate(-12deg) translate(-75%, -10%);
}

[data-length='6'] [data-position='2'] {
  transform: translate(50%, 0) rotate(-4deg) translate(-25%, -5%);
}

[data-length='6'] [data-position='3'] {
  transform: translate(-50%, 0) rotate(4deg) translate(25%, -5%);
}

[data-length='6'] [data-position='4'] {
  transform: translate(-150%, 0) rotate(12deg) translate(75%, -10%);
}

[data-length='6'] [data-position='5'] {
  transform: translate(-250%, 0) rotate(20deg) translate(125%, -15%);
}
</style>
