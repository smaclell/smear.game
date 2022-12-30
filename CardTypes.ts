export enum Suit {
  Hearts = 'Hearts',
  Diamonds = 'Diamonds',
  Spades = 'Spades',
  Clubs = 'Clubs',
  Invalid = 'Invalid',
}

export type CardValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export type Card = {
  suit: Suit;
  value: CardValue;
};

export const Emojis = {
  [Suit.Invalid]: '',
  [Suit.Hearts]: '♥️',
  [Suit.Diamonds]: '♦️',
  [Suit.Spades]: '♠️',
  [Suit.Clubs]: '♣️',
};

export const isRed = (suit: Suit) =>
  suit === Suit.Hearts || suit === Suit.Diamonds;

export const Sentinel: Card = { suit: Suit.Invalid, value: 2 };

const suitOrder = {
  [Suit.Invalid]: -1,
  [Suit.Hearts]: 1,
  [Suit.Clubs]: 2,
  [Suit.Diamonds]: 3,
  [Suit.Spades]: 4,
};

export const sort = (a: Card, b: Card): number =>
  a.suit === b.suit ? a.value - b.value : suitOrder[a.suit] - suitOrder[b.suit];
export const reverseSort = (a: Card, b: Card): number => -1 * sort(a, b);

export function shuffle<T>(array: T[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function getPerfectDeck(): Card[] {
  const suits = [Suit.Hearts, Suit.Spades, Suit.Diamonds, Suit.Clubs];
  const result: Card[] = [];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 2; j <= 14; j++) {
      result.push({ suit: suits[i], value: j as CardValue });
    }
  }

  return result;
}
