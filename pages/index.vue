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
    <div class="player-0 self-end">
      <PlayerHand v-bind="players[0]" position="bottom" />
      <PlayerLabel v-bind="players[0]" />
    </div>
    <div class="player-1 self-center">
      <PlayerHand v-bind="players[1]" position="left" />
      <PlayerLabel v-bind="players[1]" />
    </div>
    <div class="player-2 self-start">
      <PlayerLabel v-bind="players[2]" />
      <PlayerHand v-bind="players[2]" position="top" />
    </div>
    <div class="player-3 self-center">
      <PlayerHand v-bind="players[3]" position="right" />
      <PlayerLabel v-bind="players[3]" />
    </div>
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
  display: grid;
  grid-template:
    'p2 p2 p2'
    'p1 pa p3'
    'p0 p0 p0'
    'cb cb cb';
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: 1fr 3fr 1fr 1fr;
}

.play-area {
  grid-area: pa;
}

.player-0 {
  grid-area: p0;
}

.player-1 {
  grid-area: p1;
}

.player-2 {
  grid-area: p2;
}

.player-3 {
  grid-area: p3;
}

.control-bar {
  grid-area: cb;
}
</style>
