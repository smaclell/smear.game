import { isWinner, isJick, Sentinel, Suit } from '~/CardTypes';

describe('CardTypes', () => {
  describe('isJick', () => {
    it.each`
      trump            | suit             | value | result
      ${Suit.Hearts}   | ${Suit.Diamonds} | ${11} | ${true}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${11} | ${true}
      ${Suit.Spades}   | ${Suit.Clubs}    | ${11} | ${true}
      ${Suit.Clubs}    | ${Suit.Spades}   | ${11} | ${true}
      ${Suit.Hearts}   | ${Suit.Diamonds} | ${12} | ${false}
      ${Suit.Hearts}   | ${Suit.Hearts}   | ${11} | ${false}
    `(
      'when trump is $trump and the card $value of $suit isJick returns $result',
      ({ trump, suit, value, result }) => {
        expect(isJick(trump, { suit, value })).toEqual(result);
      }
    );
  });

  describe('isWinner', () => {
    it.each`
      trump            | s1               | v1    | s2               | v2    | result
      // Both in the trump suit
      ${Suit.Diamonds} | ${Suit.Diamonds} | ${11} | ${Suit.Diamonds} | ${10} | ${true}
      ${Suit.Diamonds} | ${Suit.Diamonds} | ${11} | ${Suit.Diamonds} | ${12} | ${false}
      ${Suit.Diamonds} | ${Suit.Diamonds} | ${10} | ${Suit.Hearts}   | ${11} | ${false}
      ${Suit.Diamonds} | ${Suit.Diamonds} | ${11} | ${Suit.Hearts}   | ${11} | ${true}
      ${Suit.Diamonds} | ${Suit.Diamonds} | ${14} | ${Suit.Hearts}   | ${11} | ${true}
      ${Suit.Diamonds} | ${Suit.Hearts}   | ${14} | ${Suit.Diamonds} | ${10} | ${false}
      ${Suit.Diamonds} | ${Suit.Clubs}    | ${14} | ${Suit.Diamonds} | ${12} | ${false}
      ${Suit.Diamonds} | ${Suit.Clubs}    | ${14} | ${Suit.Hearts}   | ${11} | ${false}
      ${Suit.Hearts}   | ${Suit.Clubs}    | ${14} | ${Suit.Diamonds} | ${11} | ${false}
      ${Suit.Spades}   | ${Suit.Hearts}   | ${10} | ${Suit.Hearts}   | ${12} | ${false}
      ${Suit.Invalid}  | ${Suit.Clubs}    | ${11} | ${Suit.Hearts}   | ${11} | ${true}
      ${Suit.Invalid}  | ${Suit.Diamonds} | ${11} | ${Suit.Clubs}    | ${11} | ${true}
      ${Suit.Invalid}  | ${Suit.Spades}   | ${11} | ${Suit.Diamonds} | ${11} | ${true}
      ${Suit.Invalid}  | ${Suit.Invalid}  | ${2}  | ${Suit.Diamonds} | ${2}  | ${false}
      ${Suit.Invalid}  | ${Suit.Invalid}  | ${2}  | ${Suit.Diamonds} | ${3}  | ${false}
      ${Suit.Diamonds} | ${Suit.Invalid}  | ${2}  | ${Suit.Diamonds} | ${2}  | ${false}
      ${Suit.Diamonds} | ${Suit.Invalid}  | ${2}  | ${Suit.Diamonds} | ${3}  | ${false}
    `(
      'when trump is $trump comparing ($v1, $s1) vs ($v2, $s2)',
      ({ trump, s1, v1, s2, v2, result }) => {
        const c1 = { suit: s1, value: v1 };
        const c2 = { suit: s2, value: v2 };

        expect(isWinner(trump, c1, c2)).toEqual(result);
        expect(isWinner(trump, c2, c1)).toEqual(!result);
      }
    );

    it.each`
      trump          | s1               | v1    | s2               | v2
      ${Suit.Spades} | ${Suit.Clubs}    | ${13} | ${Suit.Hearts}   | ${10}
      ${Suit.Spades} | ${Suit.Diamonds} | ${13} | ${Suit.Clubs}    | ${10}
      ${Suit.Spades} | ${Suit.Clubs}    | ${13} | ${Suit.Hearts}   | ${10}
      ${Suit.Hearts} | ${Suit.Spades}   | ${13} | ${Suit.Diamonds} | ${10}
      ${Suit.Spades} | ${Suit.Clubs}    | ${10} | ${Suit.Hearts}   | ${13}
      ${Suit.Spades} | ${Suit.Diamonds} | ${10} | ${Suit.Clubs}    | ${13}
      ${Suit.Spades} | ${Suit.Clubs}    | ${10} | ${Suit.Hearts}   | ${13}
      ${Suit.Hearts} | ${Suit.Spades}   | ${10} | ${Suit.Diamonds} | ${13}
    `(
      'when following suit comparing ($v1, $s1) vs ($v2, $s2)',
      ({ trump, s1, v1, s2, v2 }) => {
        const c1 = { suit: s1, value: v1 };
        const c2 = { suit: s2, value: v2 };

        expect(isWinner(trump, c1, c2)).toEqual(true);
      }
    );

    it('returns false when comparing sentinels', () => {
      expect(isWinner(Suit.Invalid, Sentinel, Sentinel)).toEqual(false);
    });
  });
});
