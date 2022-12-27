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
  bid: number;
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
    bid: 0,
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
        this.played = 0;
      }

      return true;
    },
  },
});
