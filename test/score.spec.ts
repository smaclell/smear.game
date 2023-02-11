import { setActivePinia, createPinia } from 'pinia';
import { Card, CardValue, Suit } from '~/CardTypes';
import { useScoreStore } from '~/store/score';

function createCard(suit: Suit, value: CardValue): Card {
  return { suit, value };
}

describe('store/score', () => {
  describe('useScoreStore', () => {
    // All Cards
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const HA = createCard(Suit.Hearts, 14);
    const HK = createCard(Suit.Hearts, 13);
    const HQ = createCard(Suit.Hearts, 12);
    const HJ = createCard(Suit.Hearts, 11);
    const HT = createCard(Suit.Hearts, 10);
    const H9 = createCard(Suit.Hearts, 9);
    const H8 = createCard(Suit.Hearts, 8);
    const H7 = createCard(Suit.Hearts, 7);
    const H6 = createCard(Suit.Hearts, 6);
    const H5 = createCard(Suit.Hearts, 5);
    const H4 = createCard(Suit.Hearts, 4);
    const H3 = createCard(Suit.Hearts, 3);
    const H2 = createCard(Suit.Hearts, 2);

    const CA = createCard(Suit.Clubs, 14);
    const CK = createCard(Suit.Clubs, 13);
    const CQ = createCard(Suit.Clubs, 12);
    const CJ = createCard(Suit.Clubs, 11);
    const CT = createCard(Suit.Clubs, 10);
    const C9 = createCard(Suit.Clubs, 9);
    const C8 = createCard(Suit.Clubs, 8);
    const C7 = createCard(Suit.Clubs, 7);
    const C6 = createCard(Suit.Clubs, 6);
    const C5 = createCard(Suit.Clubs, 5);
    const C4 = createCard(Suit.Clubs, 4);
    const C3 = createCard(Suit.Clubs, 3);
    const C2 = createCard(Suit.Clubs, 2);

    const DA = createCard(Suit.Diamonds, 14);
    const DK = createCard(Suit.Diamonds, 13);
    const DQ = createCard(Suit.Diamonds, 12);
    const DJ = createCard(Suit.Diamonds, 11);
    const DT = createCard(Suit.Diamonds, 10);
    const D9 = createCard(Suit.Diamonds, 9);
    const D8 = createCard(Suit.Diamonds, 8);
    const D7 = createCard(Suit.Diamonds, 7);
    const D6 = createCard(Suit.Diamonds, 6);
    const D5 = createCard(Suit.Diamonds, 5);
    const D4 = createCard(Suit.Diamonds, 4);
    const D3 = createCard(Suit.Diamonds, 3);
    const D2 = createCard(Suit.Diamonds, 2);

    const SA = createCard(Suit.Spades, 14);
    const SK = createCard(Suit.Spades, 13);
    const SQ = createCard(Suit.Spades, 12);
    const SJ = createCard(Suit.Spades, 11);
    const ST = createCard(Suit.Spades, 10);
    const S9 = createCard(Suit.Spades, 9);
    const S8 = createCard(Suit.Spades, 8);
    const S7 = createCard(Suit.Spades, 7);
    const S6 = createCard(Suit.Spades, 6);
    const S5 = createCard(Suit.Spades, 5);
    const S4 = createCard(Suit.Spades, 4);
    const S3 = createCard(Suit.Spades, 3);
    const S2 = createCard(Suit.Spades, 2);
    /* eslint-enable @typescript-eslint/no-unused-vars */

    beforeEach(() => {
      setActivePinia(createPinia());
    });

    it('plays a winning game with jack but without jick', () => {
      const store = useScoreStore();

      const trump = HA.suit;

      // Giving game points, highest, jack, temporary low
      let hand = [HA, HT, HJ, H3];
      expect(store.add(0, trump, hand)).toEqual(0);
      expect(store.hands[store.hands.length - 1].cards).toEqual(hand);
      expect(store.hands[store.hands.length - 1].winner).toEqual(0);

      // Winning with the suit
      hand = [D3, S9, S5, D5];
      expect(store.add(0, trump, hand)).toEqual(3);
      expect(store.hands[store.hands.length - 1].cards).toEqual(hand);
      expect(store.hands[store.hands.length - 1].winner).toEqual(3);

      // Trumps in, takes low!
      hand = [H2, S8, S6, DK];
      expect(store.add(3, trump, hand)).toEqual(0);
      expect(store.hands[store.hands.length - 1].cards).toEqual(hand);
      expect(store.hands[store.hands.length - 1].winner).toEqual(0);

      // Losing game
      hand = [CT, CA, CJ, DT];
      expect(store.add(0, trump, hand)).toEqual(1);
      expect(store.hands[store.hands.length - 1].cards).toEqual(hand);
      expect(store.hands[store.hands.length - 1].winner).toEqual(1);

      // Nothing
      hand = [C3, C2, C7, C6];
      expect(store.add(1, trump, hand)).toEqual(2);
      expect(store.hands[store.hands.length - 1].cards).toEqual(hand);
      expect(store.hands[store.hands.length - 1].winner).toEqual(2);

      // Nothing
      hand = [D4, D2, D7, D6];
      expect(store.add(2, trump, hand)).toEqual(2);
      expect(store.hands[store.hands.length - 1].cards).toEqual(hand);
      expect(store.hands[store.hands.length - 1].winner).toEqual(2);

      store.summarize(trump, [3, 2, -1, -1]);

      expect(store.scores[0].bid).toEqual(3);
      expect(store.scores[0].jack).toEqual(true);
      expect(store.scores[0].highest).toEqual(true);
      expect(store.scores[0].lowest).toEqual(true);
      expect(store.scores[0].gamePoints).toEqual(18);

      expect(store.scores[1].bid).toEqual(2);
      expect(store.scores[1].jack).toEqual(false);
      expect(store.scores[1].highest).toEqual(false);
      expect(store.scores[1].lowest).toEqual(false);
      expect(store.scores[1].gamePoints).toEqual(25);

      expect(store.scores[2].bid).toEqual(-1);
      expect(store.scores[2].jack).toEqual(false);
      expect(store.scores[2].highest).toEqual(false);
      expect(store.scores[2].lowest).toEqual(false);
      expect(store.scores[2].gamePoints).toEqual(0);

      expect(store.scores[3].bid).toEqual(-1);
      expect(store.scores[3].jack).toEqual(false);
      expect(store.scores[3].highest).toEqual(false);
      expect(store.scores[3].lowest).toEqual(false);
      expect(store.scores[3].gamePoints).toEqual(0);
    });
  });
});
