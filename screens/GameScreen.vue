<template>
  <div class="flex items-center flex-col overflow-hidden">
    <div class="outer-grid">
      <PlayArea
        v-if="mode === 'Playing'"
        class="play-area"
        :trump="trump"
        :bottom="players[0].played"
        :left="players[1].played"
        :top="players[2].played"
        :right="players[3].played"
      />
      <BiddingControls
        v-else-if="mode === 'Bidding' && !ready"
        class="play-area"
        v-bind="biddingProps"
      />

      <div class="bottom">
        <PlayerLabel v-bind="players[0]" :active="active" />
        <PlayerHand v-bind="playerProps" :player="players[0]" />
      </div>

      <div class="left">
        <PlayerLabel v-bind="players[1]" :active="active" />
        <component
          :is="OtherPlayerComponent"
          v-bind="playerProps"
          :player="players[1]"
        />
      </div>

      <div class="top">
        <component
          :is="OtherPlayerComponent"
          v-bind="playerProps"
          :player="players[2]"
        />
        <PlayerLabel v-bind="players[2]" :active="active" />
      </div>

      <div class="right">
        <PlayerLabel v-bind="players[3]" :active="active" />
        <component
          :is="OtherPlayerComponent"
          v-bind="playerProps"
          :player="players[3]"
        />
      </div>

      <GameControls
        v-if="mode === 'Playing'"
        class="control-bar"
        :trump="trump"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { computed, defineComponent } from 'vue';
import { getDebugSettings } from '@/store/debug';
import { useGameStore } from '@/store/game';
import wait from '@/store/waiter';
import HiddenHand from '@/components/HiddenHand.vue';
import PlayerHand from '@/components/PlayerHand.vue';
import { Card, Suit } from '~/CardTypes';

export default defineComponent({
  name: 'GameScreen',
  setup() {
    const { debug, layout } = getDebugSettings();

    const game = useGameStore();
    const { active, ready, started, players, mode, maxBid, trump } =
      storeToRefs(game);
    const { play, bid } = game;

    wait(game);

    return {
      active,
      ready,
      players,
      mode,
      trump,
      OtherPlayerComponent: debug && !layout ? PlayerHand : HiddenHand,
      playerProps: {
        play,
        trump,
        led: computed<Card | null>(() => {
          const card = players.value[started.value]?.played;
          return card && card.suit !== Suit.Invalid ? card : null;
        }),
      },
      biddingProps: {
        show: computed(() => debug || active.value === 0),
        best: computed(() => maxBid.value[0]),
        winner: computed(() =>
          maxBid.value[1] in players.value
            ? players.value[maxBid.value[1]].name
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

  max-width: 720px;
  max-height: 640px;
  display: grid;
  grid-template:
    'cb tt . '
    'll pa rr'
    'bb bb bb';
  grid-template-columns: minmax(80px, 150px) minmax(max-content, 1fr) minmax(
      80px,
      150px
    );
  grid-template-rows: minmax(80px, 150px) minmax(max-content, 1fr) minmax(
      80px,
      150px
    );
}

/* FYI: maybe used in cards */
.play-area {
  grid-area: pa;
}

.top {
  grid-area: tt;
  transform: translateY(-40px);
}

.bottom {
  grid-area: bb;
}

.control-bar {
  grid-area: cb;
}

.left,
.right {
  align-self: center;
  overflow: visible;
}

.left {
  grid-area: ll;
  transform: rotate(90deg) translateY(30px);
}

.right {
  grid-area: rr;
  transform: rotate(-90deg) translateY(30px);
}

@media (min-width: 640px) {
  .left {
    transform: rotate(90deg) translateY(60px);
  }

  .right {
    transform: rotate(-90deg) translateY(60px);
  }
}
</style>
