<template>
  <div class="flex items-center flex-col wrapper">
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

      <PreferencesArea :sound.sync="sound" class="player-preferences" />
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { computed, defineComponent } from 'vue';
import { getDebugSettings } from '@/store/debug';
import { useGameStore } from '@/store/game';
import { subscribe } from '@/store/ping';
import { usePreferencesStore } from '@/store/preferences';
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

    const preferences = usePreferencesStore();
    const { sound } = storeToRefs(preferences);

    wait(game);
    subscribe(game);

    return {
      sound,
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
.wrapper {
  width: 100vw;
  height: 100vh;
  color: white;
  overflow: clip;
  background-color: #35654d;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23427e60' fill-opacity='0.4' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.outer-grid {
  @apply h-screen;

  max-width: 720px;
  max-height: 640px;
  display: grid;
  grid-template:
    'cb tt pp'
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

.player-preferences {
  grid-area: pp;
  justify-self: end;
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
