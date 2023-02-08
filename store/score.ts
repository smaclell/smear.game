import { defineStore } from 'pinia';
import { PlayerIndex } from './Player';
import { Card, Sentinel, Suit } from '~/CardTypes';

export interface PlayerScore {
  id: PlayerIndex;
  bid: number;
  jack: boolean;
  highest: boolean;
  lowest: boolean;
  gamePoints: number;
}

type Hand = {
  winner: PlayerIndex;
  cards: Card[];
};

type State = {
  red: number;
  blue: number;
  scores: PlayerScore[];
  hands: Hand[];
};

function gamePoint(card: Card): number {
  if (card.value < 10) {
    return 0;
  }

  if (card.value === 10) {
    return 10;
  }

  return card.value - 10;
}

function createEmptyScore(id: PlayerIndex) {
  return {
    id,
    bid: 0,
    jack: false,
    jyck: false,
    highest: false,
    lowest: false,
    gamePoints: 0,
  };
}

export const useScoreStore = defineStore('score', {
  state: (): State => ({
    red: 0,
    blue: 0,
    scores: [
      createEmptyScore(0),
      createEmptyScore(1),
      createEmptyScore(2),
      createEmptyScore(3),
    ],
    hands: [],
    // TODO: Add running lowest and highest (highlight them)
  }),
  getters: {
    done: (state) => state.red >= 15 || state.blue >= 15,
  },
  actions: {
    reset() {
      this.$patch((state) => {
        state.scores = [
          createEmptyScore(0),
          createEmptyScore(1),
          createEmptyScore(2),
          createEmptyScore(3),
        ];

        if (this.done) {
          state.red = 0;
          state.blue = 0;
          state.hands = [];
        }
      });
    },
    add(started: PlayerIndex, trump: Suit, cards: Card[]): PlayerIndex {
      if (!trump || trump === Suit.Invalid) {
        throw new Error('There should be trump');
      }

      let winner: PlayerIndex = started;

      let highest = cards[started];

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (card === Sentinel) {
          throw new Error('Sentinel found');
        }

        const sameSuit = highest.suit === card.suit;
        const betterCard = highest.value < card.value;
        const isTrump = card.suit === trump;
        if ((betterCard && sameSuit) || (!sameSuit && isTrump)) {
          winner = i as PlayerIndex;
          highest = card;
        }
      }

      this.hands.push({ winner, cards });

      return winner;
    },
    summarize(trump: Suit, bids: number[]) {
      if (!trump || trump === Suit.Invalid) {
        throw new Error('There should be trump');
      }

      if (this.hands.length !== 6) {
        throw new Error('Not enough hands played');
      }

      let red = 0;
      let blue = 0;

      let lowestCard = Sentinel;
      let lowestPlayer = 0;

      let highestCard = Sentinel;
      let highestPlayer = 0;

      for (const { winner, cards } of this.hands) {
        let points = 0;

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];

          points += gamePoint(card);

          if (card.suit === trump) {
            if (highestCard === Sentinel || highestCard.value < card.value) {
              highestCard = card;
              highestPlayer = i;
            }

            if (lowestCard === Sentinel || lowestCard.value > card.value) {
              lowestCard = card;
              lowestPlayer = i;
            }

            if (card.value === 11) {
              this.scores[winner].jack = true;

              if (winner % 2 === 0) {
                red++;
              } else {
                blue++;
              }
            }
          }
        }

        this.scores[winner].gamePoints += points;
      }

      this.scores[highestPlayer].highest = true;
      if (highestPlayer % 2 === 0) {
        red++;
      } else {
        blue++;
      }

      this.scores[lowestPlayer].lowest = true;
      if (lowestPlayer % 2 === 0) {
        red++;
      } else {
        blue++;
      }

      const redGamePoints =
        this.scores[0].gamePoints + this.scores[2].gamePoints;
      const blueGamePoints =
        this.scores[1].gamePoints + this.scores[3].gamePoints;

      if (redGamePoints > blueGamePoints) {
        red++;
      } else if (blueGamePoints > redGamePoints) {
        blue++;
      }

      for (let i = 0; i < this.scores.length; i++) {
        this.scores[i].bid = bids[i];
      }

      // See if they won their bid!
      const redBid = Math.max(bids[0], bids[2]);
      const blueBid = Math.max(bids[1], bids[3]);

      if (redBid > blueBid && red < redBid) {
        red = -redBid;
      }

      if (blueBid > redBid && blue < blueBid) {
        blue = -blueBid;
      }

      // Update the overall score!
      this.$patch((state) => {
        state.red = state.red + red;
        state.blue = state.blue + blue;
        state.hands = [];
      });
    },
  },
});
