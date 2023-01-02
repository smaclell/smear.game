import { defineStore } from 'pinia';
import { Suit, Card, Sentinel, reverseSort } from '../CardTypes';
import { Player, PlayerIndex } from './Player';
import score, { PlayerScore } from './score';

export enum Mode {
  Dealing = 'Dealing',
  Bidding = 'Bidding',
  Playing = 'Playing',
  Score = 'Score',
  Game = 'Game',
}

const PlayerCount = 4;

type State = {
  mode: Mode;
  trump: Suit;
  played: PlayerIndex | 4;
  started: PlayerIndex;
  redScore: number;
  blueScore: number;
  players: [Player, Player, Player, Player];
  scores: PlayerScore[];
};

function createPlayer(id: PlayerIndex, name: string): Player {
  return {
    id,
    name,
    cards: [],
    won: [],
    bid: 0,
    played: Sentinel,
  };
}

export const useGameStore = defineStore('game', {
  state: (): State => ({
    played: 0,
    started: 1,

    blueScore: 0,
    redScore: 0,

    mode: Mode.Dealing,
    trump: Suit.Invalid,

    scores: [],
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
    ready: (state): boolean =>
      state.mode === Mode.Score ||
      state.mode === Mode.Game ||
      state.mode === Mode.Dealing ||
      state.played === PlayerCount,
    active: (state): PlayerIndex =>
      ((state.started + state.played) % PlayerCount) as PlayerIndex,
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
      return true;
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
        player.won = [];
      }

      this.started = starter as PlayerIndex;
      this.played = 0;

      if (this.mode === Mode.Game) {
        this.redScore = 0;
        this.blueScore = 0;
      }

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

        this.mode = bid > 0 ? Mode.Playing : Mode.Dealing;
        this.started = playerId;
        this.played = 0;

        return true;
      }

      if (this.mode === Mode.Playing) {
        const hasCards = this.players[0].cards.length > 1;
        this.mode = hasCards ? Mode.Playing : Mode.Score;

        let winner = this.players[this.started];
        let winning = winner.played;
        if (!winning || winning === Sentinel) {
          throw new Error('You have not played');
        }

        const all = [];

        for (let i = 0; i < this.players.length; i++) {
          const player = this.players[i];
          const played = player.played;
          if (!played || played === Sentinel) {
            throw new Error('Not everyone has played');
          }

          // TODO: Support JYCK
          const sameSuit = winning.suit === played.suit;
          const betterCard = winning.value < played.value;
          const isTrump = played.suit === this.trump;
          if ((betterCard && sameSuit) || (!sameSuit && isTrump)) {
            winner = player;
            winning = played;
          }

          all.push(played);

          player.cards = player.cards.filter((c) => c !== played);
          player.played = Sentinel;
        }

        winner.won.push(...all);
        this.started = winner.id;
        this.played = 0;
        return true;
      }

      if (this.mode === Mode.Score) {
        if (!this.trump || this.trump === Suit.Invalid) {
          throw new Error('There should be trump');
        }

        const result = score(this.trump, this.players);
        let { redScore: red, blueScore: blue } = result;

        const [bid, player] = this.maxBid;

        if (player === 0 || player === 2) {
          if (red < bid) {
            red = -bid;
          }
        } else if (blue < bid) {
          blue = -bid;
        }

        this.$patch((state) => {
          state.redScore += red;
          state.blueScore += blue;
          state.scores = result.scores;

          state.mode =
            state.redScore < 15 && state.blueScore < 15
              ? Mode.Dealing
              : Mode.Game;
        });
        return true;
      }

      return false;
    },
  },
});
