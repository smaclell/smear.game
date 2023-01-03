<template>
  <div class="outer-grid">
    <GameControls class="control-bar" />

    <PlayArea
      class="play-area"
      :bottom="players[0].played"
      :left="players[1].played"
      :top="players[2].played"
      :right="players[3].played"
    />

    <PlayerHand class="player-0" v-bind="players[0]" position="bottom" />
    <PlayerLabel class="label-0" v-bind="players[0]" />

    <PlayerHand class="player-1" v-bind="players[1]" position="left" />
    <PlayerLabel class="label-1" v-bind="players[1]" />

    <PlayerLabel class="label-2" v-bind="players[2]" />
    <PlayerHand class="player-2" v-bind="players[2]" position="top" />

    <PlayerHand class="player-3" v-bind="players[3]" position="right" />
    <PlayerLabel class="label-3" v-bind="players[3]" />
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';
import { useGameStore } from '@/store/game';
import wait from '@/store/waiter';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const store = useGameStore();
    const { players } = storeToRefs(store);

    wait(store);

    return {
      players,
    };
  },
});
</script>

<style lang="postcss" scoped>
.outer-grid {
  @apply h-screen;

  display: grid;
  grid-template:
    'p1 l2 p3'
    'p1 p2 p3'
    'p1 pa p3'
    'p1 p0 p3'
    'l1 l0 l3'
    'cb cb cb';
  grid-template-columns: minmax(1fr, 180px) 1fr minmax(1fr, 180px);
  grid-template-rows:
    minmax(25px, 50px) minmax(100px, 1fr) 1fr minmax(100px, 1fr)
    minmax(25px, 50px) minmax(50px, 100px);
}

.play-area {
  grid-area: pa;
}

.player-0 {
  grid-area: p0;
}

.label-0 {
  grid-area: l0;
}

.player-1 {
  grid-area: p1;
}

.label-1 {
  grid-area: l1;
}

.player-2 {
  grid-area: p2;
}

.label-2 {
  grid-area: l2;
}

.player-3 {
  grid-area: p3;
}

.label-3 {
  grid-area: l3;
}

.control-bar {
  grid-area: cb;
}
</style>
