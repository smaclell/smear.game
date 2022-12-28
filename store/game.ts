import { defineStore } from 'pinia';
import { Suit, Card, getPerfectDeck, shuffle, Sentinel } from '../CardTypes';

export enum Mode {
  Blank = 'Blank',
  Dealing = 'Dealing',
  Bidding = 'Bidding',
  Playing = 'Playing',
  Score = 'Score',
  Game = 'Game',
}

type Cards = Card[];

export type Player = {
  id: number;
  name: string;
  cards: Card[];
  played: Card;
  bid: number;
};

const PlayerCount = 4;
type PlayerIndex = 0 | 1 | 2 | 3;

type State = {
  mode: Mode;
  trump: Suit;
  dealer: PlayerIndex;
  played: PlayerIndex | 4;
  started: PlayerIndex;
  redScore: number;
  blueScore: number;
  redPlayed: Cards;
  bluePlayed: Cards;
  players: [Player, Player, Player, Player];
};

function createPlayer(id: number, name: string): Player {
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
    dealer: 0,
    played: 0,
    started: 1,

    blueScore: 0,
    redScore: 0,
    bluePlayed: [],
    redPlayed: [],

    mode: Mode.Blank,
    trump: Suit.Invalid,

    players: [
      createPlayer(0, 'scott'),
      createPlayer(1, 'mom'),
      createPlayer(2, 'dad'),
      createPlayer(3, 'ange'),
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
    ready: (state): boolean =>
      state.mode === Mode.Blank ||
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

      const found = player.cards.find((c) => c === card);
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
    next() {
      if (!this.ready) {
        return false;
      }

      if (this.mode === Mode.Bidding) {
        this.mode = Mode.Playing;

        const bid = this.maxBid;
        this.started = bid[1] as PlayerIndex;
        this.played = 0;

        return true;
      }

      if (this.mode === Mode.Playing) {
        const hasCards = this.players[0].cards.length > 1;
        this.mode = hasCards ? Mode.Playing : Mode.Score;

        let winner: PlayerIndex = this.started;
        let winning = this.players[this.started].played;
        if (!winning || winning === Sentinel) {
          throw new Error('You have not played');
        }

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
            winner = i as PlayerIndex;
            winning = played;
          }

          const team = i === 0 || i === 2 ? this.redPlayed : this.bluePlayed;
          team.push(played);

          player.cards = player.cards.filter((c) => c !== played);
          player.played = Sentinel;
        }

        this.started = winner;
        this.played = 0;
        return true;
      }

      if (this.mode === Mode.Score) {
        if (!this.trump || this.trump === Suit.Invalid) {
          throw new Error('There should be trump');
        }

        function gamePoint(card: Card): number {
          if (card.value < 10) {
            return 0;
          }

          if (card.value === 10) {
            return 10;
          }

          return card.value - 10;
        }

        function gamePoints(hand: Cards): number {
          return hand.reduce((a, c) => a + gamePoint(c), 0);
        }

        function max(hand: Cards): Card | undefined {
          return hand.reduce((a, c) => (a?.value < c.value ? c : a), hand[0]);
        }

        function min(hand: Cards): Card | undefined {
          return hand.reduce((a, c) => (a?.value > c.value ? c : a), hand[0]);
        }

        function hasJack(hand: Cards): boolean {
          return !!hand.find((c) => c.value === 11);
        }

        let red = 0;
        let blue = 0;

        const redGame = gamePoints(this.redPlayed);
        const blueGame = gamePoints(this.bluePlayed);

        // TODO: Can there be ties?
        if (redGame > blueGame) {
          red++;
        } else {
          blue++;
        }

        const redTrump = this.redPlayed.filter((c) => c.suit === this.trump);
        const blueTrump = this.bluePlayed.filter((c) => c.suit === this.trump);

        const redMax = max(redTrump);
        const redMin = min(redTrump);

        const blueMax = max(blueTrump);
        const blueMin = min(blueTrump);

        if (redMax && blueMax) {
          if (redMax.value > blueMax.value) {
            red++;
          } else {
            blue++;
          }
        } else if (redMax && !blueMax) {
          red++;
        } else if (!redMax && blueMax) {
          blue++;
        } else {
          throw new Error('no Max found');
        }

        if (redMin && blueMin) {
          if (redMin.value < blueMin.value) {
            red++;
          } else {
            blue++;
          }
        } else if (redMin && !blueMin) {
          red++;
        } else if (!redMin && blueMin) {
          blue++;
        } else {
          throw new Error('no Min found');
        }

        if (hasJack(redTrump)) {
          red++;
        }

        if (hasJack(blueTrump)) {
          blue++;
        }

        const [bid, player] = this.maxBid;

        if (player === 0 || player === 2) {
          if (red < bid) {
            red = -bid;
          }
        } else if (blue < bid) {
          blue = -bid;
        }

        this.redScore += red;
        this.blueScore += blue;

        this.redPlayed = [];
        this.bluePlayed = [];

        this.mode = Mode.Dealing;
        return true;
      }

      if (this.mode === Mode.Dealing) {
        const deck = shuffle(getPerfectDeck());

        const suitOrder = {
          [Suit.Invalid]: -1,
          [Suit.Hearts]: 1,
          [Suit.Clubs]: 2,
          [Suit.Diamonds]: 3,
          [Suit.Spades]: 4,
        };

        const sort = (a: Card, b: Card): number =>
          a.suit === b.suit
            ? a.value - b.value
            : suitOrder[a.suit] - suitOrder[b.suit];
        const reverse = (a: Card, b: Card): number => -1 * sort(a, b);

        for (let i = 0; i < this.players.length; i++) {
          this.players[i].bid = 0;
          this.players[i].cards = deck.slice(6 * i, 6 * (i + 1));
          this.players[i].cards.sort(reverse);
        }

        this.dealer = ((this.dealer + 1) % PlayerCount) as PlayerIndex;
        this.started = ((this.dealer + 1) % PlayerCount) as PlayerIndex;
        this.played = 0;

        this.trump = Suit.Invalid;
        this.mode = Mode.Bidding;

        return true;
      }

      if (this.mode === Mode.Blank) {
        this.mode = Mode.Dealing;
        return true;
      }

      return false;
    },
  },
});
