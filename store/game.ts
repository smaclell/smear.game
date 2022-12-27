import { defineStore } from 'pinia';
import { Suit, Card } from '../CardTypes';

export enum Mode {
  Blank,
  Bidding,
  Playing,
  Score,
}

type Cards = Card[];

type Player = {
  name: string;
  cards: Cards;
  played?: Card;
  bid?: number;
};

const PlayerCount = 4;
type PlayerIndex = 0 | 1 | 2 | 3;

type State = {
  mode: Mode;
  trump?: Suit;
  dealer: PlayerIndex;
  played: PlayerIndex;
  started: PlayerIndex;
  redScore: number;
  blueScore: number;
  redPlayed: Cards;
  bluePlayed: Cards;
  players: [Player, Player, Player, Player];
};

function createPlayer(name: string): Player {
  return {
    name,
    cards: [],
  };
}

export const useGameStore = defineStore('game', {
  state: (): State => ({
    dealer: 0,
    played: 0,
    started: 1,

    blueScore: 0,
    redScore: 0,
    bluePlayed: [],
    redPlayed: [],

    mode: Mode.Blank,

    players: [
      createPlayer('scott'),
      createPlayer('mom'),
      createPlayer('dad'),
      createPlayer('ange'),
    ],
  }),
  getters: {
    maxBid(state): [number, number] {
      return state.players.reduce(
        ([mb, mi], c, i) => {
          if (c.bid && mb < c.bid) {
            return [c.bid, i];
          }
          return [mb, mi];
        },
        [-1, 0]
      );
    },
    active: (state): PlayerIndex =>
      ((state.started + state.played) % PlayerCount) as PlayerIndex,
  },
  actions: {
    bid(playerId: PlayerIndex, value: number) {
      if (this.active !== playerId || this.mode !== Mode.Bidding) {
        return false;
      }

      this.played++;
      this.players[playerId].bid = value;
      if (this.played === PlayerCount) {
        this.mode = Mode.Playing;

        const bid = this.maxBid;
        this.started = bid[1] as PlayerIndex;
        this.played = 0;
      }

      return true;
    },
    play(playerId: PlayerIndex, card: Card) {
      if (this.active !== playerId || this.mode !== Mode.Playing) {
        return false;
      }

      const player = this.players[playerId];
      if (player.played) {
        return false;
      }

      const found = player.cards.find((c) => c === card);
      if (!found) {
        return false;
      }

      if (!this.trump) {
        this.trump = found.suit;
      }

      this.played++;
      player.played = found;
      return true;
    },
  },
});
