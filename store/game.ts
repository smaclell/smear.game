import { defineStore } from 'pinia';
import {
  Suit,
  Card,
  Sentinel,
  reverseSort,
  shuffle,
  getPerfectDeck,
} from '../CardTypes';
import { Player, PlayerIndex } from './Player';
import { useScoreStore } from './score';

export enum Mode {
  Start = 'Start',
  Bidding = 'Bidding',
  Playing = 'Playing',
  Score = 'Score',
}

const PlayerCount = 4;

type State = {
  mode: Mode;
  trump: Suit;
  dealer: PlayerIndex;
  played: PlayerIndex | 4;
  started: PlayerIndex;
  players: [Player, Player, Player, Player];
};

function createPlayer(id: PlayerIndex, name: string): Player {
  return {
    id,
    name,
    cards: [],
    bid: 0,
    played: Sentinel,
  };
}

export const useGameStore = defineStore('game', {
  state: (): State => ({
    dealer: (Math.floor(Math.random() * 4) % 4) as PlayerIndex,
    played: 0,
    started: 1,

    mode: Mode.Start,
    trump: Suit.Invalid,

    players: [
      createPlayer(0, 'scott'),
      createPlayer(1, 'mom'),
      createPlayer(2, 'dad'),
      createPlayer(3, 'ange'),
    ],
  }),
  getters: {
    maxBid(state): [number, PlayerIndex] {
      return state.players.reduce(
        ([mb, mi], c, i) => {
          if (c.bid && mb < c.bid) {
            return [c.bid, i as PlayerIndex];
          }
          return [mb, mi];
        },
        [-1, 0 as PlayerIndex]
      );
    },
    ready: (state): boolean => state.played === PlayerCount,
    active() {
      const active = ((this.started + this.played) %
        PlayerCount) as PlayerIndex;
      // @ts-ignore - will be evaluated
      return !this.ready ? active : -1;
    },
  },
  actions: {
    bid(playerId: PlayerIndex, value: number) {
      if (
        this.active !== playerId ||
        (this.mode !== Mode.Bidding && !this.ready)
      ) {
        return false;
      }

      if (this.players[playerId].bid) {
        return false;
      }

      this.played++;
      this.players[playerId].bid = value;

      return true;
    },
    play(playerId: PlayerIndex, card: Card) {
      if (
        this.active !== playerId ||
        (this.mode !== Mode.Playing && !this.ready)
      ) {
        return false;
      }

      const player = this.players[playerId];
      if (player.played !== Sentinel) {
        return false;
      }

      const found = player.cards.find(
        (c) => c.suit === card.suit && c.value === card.value
      );
      if (!found) {
        return false;
      }

      if (!this.trump || this.trump === Suit.Invalid) {
        this.trump = found.suit;
      }

      this.played++;
      player.played = found;
      player.cards = player.cards.filter(
        (c) => !(c.suit === card.suit && c.value === card.value)
      );
      return true;
    },
    deal() {
      // TODO: Can these methods be simplified?
      this.dealer = ((this.dealer + 1) % 4) as PlayerIndex;
      const deck = shuffle(getPerfectDeck());
      this.start(0, this.dealer, deck);
    },
    start(offset: number, dealer: number, deck: Card[]) {
      const starter = (dealer + 1) % PlayerCount;

      for (let i = 0; i < this.players.length; i++) {
        const x = (starter + i) % PlayerCount;
        const y = (starter + i + offset) % PlayerCount;
        const player = this.players[x];
        player.bid = 0;
        player.cards = deck.slice(6 * y, 6 * (y + 1));
        player.cards.sort(reverseSort);
      }

      const scores = useScoreStore();
      scores.reset();

      this.started = starter as PlayerIndex;
      this.played = 0;

      this.trump = Suit.Invalid;
      this.mode = Mode.Bidding;
    },
    rotate(positions: number) {
      if (positions < 0) {
        throw new Error('Cannot be less than zero');
      }

      if (positions === 0) {
        return;
      }

      const player = this.players.shift();
      if (!player) {
        throw new Error('There should always be a player');
      }

      this.players.push(player);
      this.players.forEach((p, i) => {
        p.id = i as PlayerIndex;
      });

      this.rotate(positions - 1);
    },
    next() {
      if (!this.ready) {
        return false;
      }

      if (this.mode === Mode.Bidding) {
        const [bid, playerId] = this.maxBid;

        this.$patch({
          mode: bid > 0 ? Mode.Playing : Mode.Start,
          started: playerId,
          played: 0,
        });

        return true;
      }

      if (this.mode === Mode.Playing) {
        this.$patch((state) => {
          const scores = useScoreStore();

          const played = [];
          for (const player of state.players) {
            played.push(player.played);
            player.played = Sentinel;
          }

          const winner = scores.add(state.started, state.trump, played);
          state.started = winner;
          state.played = 0;

          const hasCards = state.players[0].cards.length > 0;
          state.mode = hasCards ? Mode.Playing : Mode.Score;
          if (!hasCards) {
            const scores = useScoreStore();
            scores.summarize(
              this.trump,
              this.players.map((p) => p.bid)
            );
          }
        });

        return true;
      }

      return false;
    },
  },
});
