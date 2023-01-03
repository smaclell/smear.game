import { Card, CardValue, Sentinel, Suit } from '~/CardTypes';
import { Player, PlayerIndex } from '~/store/Player';
import score from '~/store/score';

function createCard(suit: Suit, value: CardValue): Card {
  return { suit, value };
}

const two = createCard(Suit.Hearts, 2);
const three = createCard(Suit.Hearts, 3);
const six = createCard(Suit.Clubs, 6);
const seven = createCard(Suit.Spades, 7);
const ten = createCard(Suit.Hearts, 10);
const jack = createCard(Suit.Hearts, 11);
const queen = createCard(Suit.Clubs, 12);
const king = createCard(Suit.Spades, 13);
const ace = createCard(Suit.Hearts, 14);

function createPlayer(id: PlayerIndex, bid: number, ...won: Card[]): Player {
  return {
    id,
    name: 'Player McCardface',
    cards: [],
    played: Sentinel,
    won,
    bid,
  };
}

function A(bid: number, ...won: Card[]) {
  return createPlayer(0, bid, ...won);
}

function B(bid: number, ...won: Card[]) {
  return createPlayer(1, bid, ...won);
}

describe('store/score', () => {
  describe('basics', () => {
    let result: ReturnType<typeof score>;
    beforeAll(() => {
      result = score(two.suit, [A(2, two, ace), B(2, ten, jack)]);
    });

    // Due to how lowest is treated
    it('scores 1 for red', () => expect(result.redScore).toEqual(1));
    it('scores 2 for blue', () => expect(result.blueScore).toEqual(2));

    it('finds the highest', () => {
      const [a, b] = result.scores;

      expect(a.highest).toEqual(true);
      expect(b.highest).toEqual(false);
    });

    // HACK: We cannot compute lowest off the winning hands alone
    it('sets lowest to false', () => {
      const [a, b] = result.scores;

      expect(a.lowest).toEqual(false);
      expect(b.lowest).toEqual(false);
    });

    it('finds the jack', () => {
      const [a, b] = result.scores;

      expect(a.jack).toEqual(false);
      expect(b.jack).toEqual(true);
    });

    it('adds the game points', () => {
      const [a, b] = result.scores;

      expect(a.gamePoints).toEqual(4);
      expect(b.gamePoints).toEqual(11);
    });
  });

  describe('gameScore', () => {
    it('adds up all scoring cards', () => {
      const result = score(two.suit, [A(2, queen, king, ace, jack), B(2, ten)]);

      const [a, b] = result.scores;
      expect(a.gamePoints).toEqual(10);
      expect(b.gamePoints).toEqual(10);
    });

    it('ignores others cards', () => {
      const result = score(two.suit, [A(2, three, six), B(2, seven, two)]);

      const [a, b] = result.scores;
      expect(a.gamePoints).toEqual(0);
      expect(b.gamePoints).toEqual(0);
    });
  });
});
