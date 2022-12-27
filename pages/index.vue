<template>
  <div class="grid grid-cols-3 grid-rows-3">
    <PlayArea
      class="col-start-2 row-start-2"
      :left="left"
      :top="top"
      :right="right"
      :bottom="bottom"
    />
    <PlayerHand class="col-span-3 row-start-3 self-end" :cards="hand" />
  </div>
</template>

<script setup lang="ts">
import Vue from 'vue';
import { shuffle, getPerfectDeck } from '../CardTypes';
</script>

<script lang="ts">
const deck = shuffle(getPerfectDeck());
const hand = deck.slice(0, 6);
const [left, top, right, bottom] = deck.slice(6, 10);

export default Vue.extend({
  name: 'IndexPage',
});
</script>
