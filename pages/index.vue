<template>
  <div class="grid grid-cols-3 grid-rows-3 h-screen">
    <PlayArea
      class="col-start-2 row-start-2"
      :left="left"
      :top="top"
      :right="right"
      :bottom="bottom"
    />
    <PlayerHand
      class="row-span-3 row-start-1 col-start-1 self-center"
      v-bind="mom"
    />
    <PlayerHand
      class="col-span-3 col-start-1 row-start-1 self-start"
      v-bind="dad"
    />
    <PlayerHand
      class="row-span-3 row-start-1 col-start-3 self-center"
      v-bind="ange"
    />
    <PlayerHand
      class="col-span-3 col-start-1 row-start-3 self-end"
      v-bind="scott"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { shuffle, getPerfectDeck } from '../CardTypes';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const deck = shuffle(getPerfectDeck());

    let left, top, right, bottom;

    const scott = {
      active: false,
      name: 'scott',
      cards: deck.slice(0, 6),
    };

    const mom = {
      active: false,
      name: 'mom',
      cards: deck.slice(6, 12),
    };

    const dad = {
      active: false,
      name: 'dad',
      cards: deck.slice(12, 18),
    };

    const ange = {
      active: false,
      name: 'ange',
      cards: deck.slice(18, 24),
    };

    return {
      dad,
      mom,
      scott,
      ange,
      left,
      top,
      bottom,
      right,
    };
  },
});
</script>
