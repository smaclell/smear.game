import { Suit } from '~/CardTypes';
import { isRecommended, isRequired, isAllowed } from '~/PlayableHelpers';

describe('PlayableHelpers', () => {
  describe('isRecommended', () => {
    it.each`
      trump            | fs               | fv    | suit             | value | result
      // First matches Trump
      ${Suit.Diamonds} | ${Suit.Diamonds} | ${12} | ${Suit.Diamonds} | ${14} | ${true}
      ${Suit.Diamonds} | ${Suit.Diamonds} | ${12} | ${Suit.Diamonds} | ${11} | ${true}
      ${Suit.Diamonds} | ${Suit.Diamonds} | ${12} | ${Suit.Hearts}   | ${11} | ${true}
      ${Suit.Diamonds} | ${Suit.Diamonds} | ${12} | ${Suit.Clubs}    | ${10} | ${false}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${11} | ${Suit.Diamonds} | ${11} | ${true}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${11} | ${Suit.Diamonds} | ${12} | ${true}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${11} | ${Suit.Hearts}   | ${14} | ${false}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${12} | ${Suit.Diamonds} | ${14} | ${true}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${12} | ${Suit.Diamonds} | ${11} | ${true}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${12} | ${Suit.Hearts}   | ${11} | ${true}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${12} | ${Suit.Hearts}   | ${10} | ${true}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${12} | ${Suit.Clubs}    | ${10} | ${false}
    `(
      'with $trump trump and ($fs, $fv) played the card ($suit, $value) returns $result',
      ({ trump, fs, fv, suit, value, result }) => {
        const led = { suit: fs, value: fv };
        const card = { suit, value };
        expect(isRecommended(trump, led, card)).toEqual(result);
      }
    );
  });

  describe('isRequired', () => {
    it.each`
      trump            | fs               | fv    | suit             | value | result
      ${Suit.Diamonds} | ${Suit.Diamonds} | ${12} | ${Suit.Diamonds} | ${14} | ${true}
      ${Suit.Diamonds} | ${Suit.Diamonds} | ${12} | ${Suit.Diamonds} | ${11} | ${true}
      ${Suit.Diamonds} | ${Suit.Diamonds} | ${12} | ${Suit.Hearts}   | ${11} | ${true}
      ${Suit.Diamonds} | ${Suit.Diamonds} | ${12} | ${Suit.Clubs}    | ${10} | ${false}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${11} | ${Suit.Diamonds} | ${11} | ${true}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${11} | ${Suit.Diamonds} | ${12} | ${true}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${11} | ${Suit.Hearts}   | ${14} | ${false}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${12} | ${Suit.Diamonds} | ${14} | ${false}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${12} | ${Suit.Diamonds} | ${11} | ${false}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${12} | ${Suit.Hearts}   | ${11} | ${false}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${12} | ${Suit.Hearts}   | ${10} | ${true}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${12} | ${Suit.Clubs}    | ${10} | ${false}
      ${Suit.Diamonds} | ${Suit.Clubs}    | ${12} | ${Suit.Clubs}    | ${11} | ${true}
      ${Suit.Diamonds} | ${Suit.Clubs}    | ${12} | ${Suit.Spades}   | ${11} | ${false}
    `(
      'with $trump trump and ($fs, $fv) played the card ($suit, $value) returns $result',
      ({ trump, fs, fv, suit, value, result }) => {
        const led = { suit: fs, value: fv };
        const card = { suit, value };
        expect(isRequired(trump, led, card)).toEqual(result);
      }
    );
  });

  describe('isAllowed', () => {
    const trump = Suit.Diamonds;

    const trumpCard = { suit: Suit.Diamonds, value: 10 };
    const jack = { suit: Suit.Diamonds, value: 11 };
    const jick = { suit: Suit.Hearts, value: 11 };

    const other = { suit: Suit.Clubs, value: 3 };

    it('nothing played allows trump, jick or other', () => {
      const hand = [trumpCard, jack, jick, other];

      expect(isAllowed(trump, null, hand, trumpCard)).toBe(true);
      expect(isAllowed(trump, null, hand, jack)).toBe(true);
      expect(isAllowed(trump, null, hand, jick)).toBe(true);
      expect(isAllowed(trump, null, hand, other)).toBe(true);
    });

    it('trump led allows trump or jick and no others', () => {
      const led = { suit: Suit.Diamonds, value: 2 };

      expect(isAllowed(trump, led, [trumpCard], trumpCard)).toBe(true);
      expect(isAllowed(trump, led, [jack], jack)).toBe(true);
      expect(isAllowed(trump, led, [jick], jick)).toBe(true);

      expect(isAllowed(trump, led, [trumpCard, other], other)).toBe(false);
      expect(isAllowed(trump, led, [jack, other], other)).toBe(false);
      expect(isAllowed(trump, led, [jick, other], other)).toBe(false);
      expect(isAllowed(trump, led, [other], other)).toBe(true);
    });

    it('jick led allows trump and no other', () => {
      const led = jick;

      expect(isAllowed(trump, led, [trumpCard], trumpCard)).toBe(true);
      expect(isAllowed(trump, led, [jack], jack)).toBe(true);
      expect(isAllowed(trump, led, [trumpCard, other], other)).toBe(false);
      expect(isAllowed(trump, led, [other], other)).toBe(true);
    });

    it('other led allows trump, jick and matching', () => {
      const led = { suit: other.suit, value: 7 };
      const diff = { suit: Suit.Spades, value: 6 };

      expect(isAllowed(trump, led, [trumpCard], trumpCard)).toBe(true);
      expect(isAllowed(trump, led, [jack], jack)).toBe(true);
      expect(isAllowed(trump, led, [jick], jick)).toBe(true);

      expect(isAllowed(trump, led, [other, trumpCard], trumpCard)).toBe(true);
      expect(isAllowed(trump, led, [other, jack], jack)).toBe(true);
      expect(isAllowed(trump, led, [other, jick], jick)).toBe(true);
      expect(isAllowed(trump, led, [other], other)).toBe(true);

      expect(isAllowed(trump, led, [other, diff], diff)).toBe(false);
      expect(isAllowed(trump, led, [trumpCard, diff], diff)).toBe(true);
      expect(isAllowed(trump, led, [diff], diff)).toBe(true);
    });
  });
});
