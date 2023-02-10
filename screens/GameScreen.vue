<template>
  <div class="outer-grid">
    <PlayArea
      v-if="mode === 'Playing'"
      class="play-area"
      :bottom="players[0].played"
      :left="players[1].played"
      :top="players[2].played"
      :right="players[3].played"
    />
    <BiddingControls
      v-else-if="mode === 'Bidding' && !ready"
      v-bind="bidding"
    />

    <PlayerHand class="player-0" v-bind="players[0]" position="bottom" />
    <PlayerLabel class="label-0" v-bind="players[0]" />

    <PlayerHand class="player-1" v-bind="players[1]" position="left" />
    <PlayerLabel class="label-1" v-bind="players[1]" />

    <PlayerLabel class="label-2" v-bind="players[2]" />
    <PlayerHand class="player-2" v-bind="players[2]" position="top" />

    <PlayerHand class="player-3" v-bind="players[3]" position="right" />
    <PlayerLabel class="label-3" v-bind="players[3]" />

    <GameControls
      v-if="mode === 'Playing'"
      class="control-bar"
      :trump="trump"
      :red-score="redScore"
      :blue-score="blueScore"
    />
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { computed, defineComponent } from 'vue';
import { getDebugSettings } from '@/store/debug';
import { useGameStore } from '@/store/game';
import { useScoreStore } from '@/store/score';
import wait from '@/store/waiter';

export default defineComponent({
  name: 'GameScreen',
  setup() {
    const { debug } = getDebugSettings();

    const game = useGameStore();
    const { active, ready, players, mode, maxBid, trump } = storeToRefs(game);
    const { bid } = game;

    const scores = useScoreStore();
    const { red: redScore, blue: blueScore } = storeToRefs(scores);

    wait(game);

    return {
      ready,
      players,
      mode,
      trump,
      redScore,
      blueScore,
      bidding: {
        show: () => debug || active.value === 0,
        best: computed(() => maxBid.value[0]),
        winning: computed(() =>
          maxBid.value[1] in players.value
            ? players.value[maxBid.value[1]]
            : null
        ),
        bid: (value: number) => active.value !== -1 && bid(active.value, value),
      },
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
