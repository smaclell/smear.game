import { setActivePinia, createPinia } from 'pinia';
import { Mode, useGameStore } from '@/store/game';
import { Card, CardValue, Suit, Sentinel } from '~/CardTypes';

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

describe('store/game', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  describe('maxBid', () => {
    it('defaults to [-1, 0]', () => {
      const store = useGameStore();

      expect(store.maxBid).toEqual([-1, 0]);
    });

    it.each`
      p0    | p1    | p2    | p3    | b    | p
      ${2}  | ${-1} | ${-1} | ${-1} | ${2} | ${0}
      ${-1} | ${2}  | ${-1} | ${-1} | ${2} | ${1}
      ${-1} | ${-1} | ${2}  | ${-1} | ${2} | ${2}
      ${-1} | ${-1} | ${-1} | ${2}  | ${2} | ${3}
      ${2}  | ${0}  | ${0}  | ${0}  | ${2} | ${0}
      ${0}  | ${2}  | ${0}  | ${0}  | ${2} | ${1}
      ${0}  | ${0}  | ${2}  | ${0}  | ${2} | ${2}
      ${0}  | ${0}  | ${0}  | ${2}  | ${2} | ${3}
      ${2}  | ${0}  | ${0}  | ${3}  | ${3} | ${3}
      ${0}  | ${0}  | ${3}  | ${4}  | ${4} | ${3}
      ${2}  | ${3}  | ${4}  | ${0}  | ${4} | ${2}
      ${0}  | ${4}  | ${3}  | ${2}  | ${4} | ${1}
      ${2}  | ${0}  | ${4}  | ${3}  | ${4} | ${2}
      ${3}  | ${0}  | ${4}  | ${2}  | ${4} | ${2}
    `(
      'Bids of p0=$p0. p1=$p1, p2=$p2, p3=$p3 should be [$b, $p]',
      ({ p0, p1, p2, p3, b, p }) => {
        const store = useGameStore();

        if (p0 >= 0) {
          store.players[0].bid = p0;
        }

        if (p1 >= 0) {
          store.players[1].bid = p1;
        }

        if (p2 >= 0) {
          store.players[2].bid = p2;
        }

        if (p3 >= 0) {
          store.players[3].bid = p3;
        }

        expect(store.maxBid).toEqual([b, p]);
      }
    );
  });

  describe('bidding', () => {
    function setup() {
      const store = useGameStore();
      store.$patch({
        mode: Mode.Bidding,
      });

      return store;
    }

    it('can bid for one player', () => {
      const store = setup();

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.bid(1, 2)).toBe(true);

      expect(store.played).toEqual(1);
      expect(store.active).toEqual(2);

      expect(store.players[1].bid).toEqual(2);
    });

    it('can bid for all player', () => {
      const store = setup();

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.bid(1, 2)).toBe(true);
      expect(store.bid(2, 3)).toBe(true);
      expect(store.bid(3, 4)).toBe(true);
      expect(store.bid(0, 5)).toBe(true);

      expect(store.players[0].bid).toEqual(5);
      expect(store.players[1].bid).toEqual(2);
      expect(store.players[2].bid).toEqual(3);
      expect(store.players[3].bid).toEqual(4);

      expect(store.started).toEqual(1);
      expect(store.active).toEqual(-1);
      expect(store.played).toEqual(4);

      expect(store.ready).toEqual(true);
      expect(store.mode).toEqual(Mode.Bidding);
    });

    it('cannot bid for the wrong player', () => {
      const store = setup();

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.players[1].bid).toEqual(0);

      expect(store.bid(2, 2)).toBe(false);

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.players[1].bid).toEqual(0);
    });

    it('cannot bid while playing', () => {
      const store = setup();
      store.$patch({ mode: Mode.Playing });

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.bid(1, 2)).toBe(false);

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);
    });
  });

  describe('playing', () => {
    it('first play sets trump', () => {
      const store = useGameStore();
      store.$patch({
        mode: Mode.Playing,
      });

      store.players[1].cards = [two];
      expect(store.players[1].played).toBe(Sentinel);

      expect(store.trump).toBe(Suit.Invalid);

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.play(1, two)).toBe(true);

      expect(store.players[1].played).toEqual(two);

      expect(store.trump).toEqual(two.suit);
      expect(store.played).toEqual(1);
      expect(store.active).toEqual(2);
    });

    it('play each player', () => {
      const store = useGameStore();
      store.$patch({
        mode: Mode.Playing,
      });

      store.players[0].cards = [seven];
      expect(store.players[0].played).toBe(Sentinel);

      store.players[1].cards = [two];
      expect(store.players[1].played).toBe(Sentinel);

      store.players[2].cards = [ten];
      expect(store.players[2].played).toBe(Sentinel);

      store.players[3].cards = [ace];
      expect(store.players[3].played).toBe(Sentinel);

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.play(1, two)).toBe(true);
      expect(store.play(2, ten)).toBe(true);
      expect(store.play(3, ace)).toBe(true);
      expect(store.play(0, seven)).toBe(true);

      expect(store.players[0].played).toEqual(seven);
      expect(store.players[1].played).toEqual(two);
      expect(store.players[2].played).toEqual(ten);
      expect(store.players[3].played).toEqual(ace);

      expect(store.ready).toEqual(true);
      expect(store.mode).toEqual(Mode.Playing);
    });

    it('only play once', () => {
      const store = useGameStore();
      store.$patch({
        mode: Mode.Playing,
      });

      store.players[1].cards = [two];
      store.players[1].played = two;

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.play(1, two)).toBe(false);

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);
    });

    it('only play your cards', () => {
      const store = useGameStore();
      store.$patch({
        mode: Mode.Playing,
      });

      store.players[1].cards = [two];

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.play(1, three)).toBe(false);

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);
    });

    it('only play your turn', () => {
      const store = useGameStore();
      store.$patch({
        mode: Mode.Playing,
      });

      store.players[1].cards = [two];
      store.players[2].cards = [three];

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.play(2, three)).toBe(false);

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);
    });

    it('only play during playing', () => {
      const store = useGameStore();
      store.$patch({
        mode: Mode.Bidding,
      });

      store.players[1].cards = [two];

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.play(1, two)).toBe(false);

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);
    });
  });

  describe('next', () => {
    describe('moves to playing after', () => {
      it('everyone bids', () => {
        const store = useGameStore();
        store.$patch({
          mode: Mode.Bidding,
          started: 1,
          played: 4,
        });

        store.players[0].bid = 2;
        store.players[2].bid = 3;
        expect(store.ready).toBe(true);

        expect(store.next()).toEqual(true);

        expect(store.ready).toBe(false);
        expect(store.played).toEqual(0);
        expect(store.started).toEqual(2);
        expect(store.mode).toEqual(Mode.Playing);
      });
    });

    describe('after playing', () => {
      it('moves to scoring from the last hand without trump', () => {
        const store = useGameStore();
        store.$patch({
          mode: Mode.Playing,
          started: 2,
          played: 4,
          trump: Suit.Clubs,
          lowestCard: queen,
          lowestPlayer: 0,
        });

        // HACK: This was needed to pass
        store.lowestCard = queen;
        expect(store.lowestCard).toEqual(queen);

        store.players[0].cards = [seven];
        store.players[0].played = seven;

        store.players[1].cards = [two];
        store.players[1].played = two;

        store.players[2].cards = [ten];
        store.players[2].played = ten;

        store.players[3].cards = [ace];
        store.players[3].played = ace;

        expect(store.ready).toBe(true);

        expect(store.next()).toEqual(true);

        expect(store.players[0].cards).toEqual([]);
        expect(store.players[0].played).toBe(Sentinel);

        expect(store.players[1].cards).toEqual([]);
        expect(store.players[1].played).toBe(Sentinel);

        expect(store.players[2].cards).toEqual([]);
        expect(store.players[2].played).toBe(Sentinel);

        expect(store.players[3].cards).toEqual([]);
        expect(store.players[3].played).toBe(Sentinel);

        expect(store.players[0].won).toEqual([]);
        expect(store.players[2].won).toEqual([]);
        expect(store.players[1].won).toEqual([]);
        expect(store.players[3].won).toEqual(
          expect.arrayContaining([seven, ten, two, ace])
        );

        expect(store.played).toEqual(0);
        expect(store.started).toEqual(3);
        expect(store.mode).toEqual(Mode.Score);
      });

      it('moves to scoring the last hand with trump', () => {
        const store = useGameStore();
        store.$patch({
          mode: Mode.Playing,
          started: 2,
          played: 4,
          trump: Suit.Spades,
          lowestCard: seven,
          lowestPlayer: 0,
        });

        expect(store.trump).toEqual(Suit.Spades);

        store.players[0].cards = [seven];
        store.players[0].played = seven;

        store.players[1].cards = [two];
        store.players[1].played = two;

        store.players[2].cards = [ten];
        store.players[2].played = ten;

        store.players[3].cards = [ace];
        store.players[3].played = ace;

        expect(store.ready).toBe(true);

        expect(store.next()).toEqual(true);

        expect(store.players[0].cards).toEqual([]);
        expect(store.players[0].played).toBe(Sentinel);

        expect(store.players[1].cards).toEqual([]);
        expect(store.players[1].played).toBe(Sentinel);

        expect(store.players[2].cards).toEqual([]);
        expect(store.players[2].played).toBe(Sentinel);

        expect(store.players[3].cards).toEqual([]);
        expect(store.players[3].played).toBe(Sentinel);

        expect(store.players[0].won).toEqual(
          expect.arrayContaining([seven, ten, two, ace])
        );
        expect(store.players[2].won).toEqual([]);
        expect(store.players[1].won).toEqual([]);
        expect(store.players[3].won).toEqual([]);

        expect(store.played).toEqual(0);
        expect(store.started).toEqual(0);
        expect(store.mode).toEqual(Mode.Score);
      });

      it('plays again if there are more cards', () => {
        const store = useGameStore();
        store.$patch({
          mode: Mode.Playing,
          started: 2,
          played: 4,
          trump: Suit.Spades,
          lowestCard: seven,
          lowestPlayer: 0,
        });

        const tenSpades = createCard(Suit.Spades, 10);

        store.players[0].cards = [seven, six];
        store.players[0].played = seven;

        store.players[1].cards = [two];
        store.players[1].played = two;

        store.players[2].cards = [tenSpades];
        store.players[2].played = tenSpades;

        store.players[3].cards = [ace];
        store.players[3].played = ace;

        expect(store.ready).toBe(true);

        expect(store.next()).toEqual(true);

        expect(store.players[0].cards).toEqual([six]);
        expect(store.players[0].played).toBe(Sentinel);

        expect(store.players[1].cards).toEqual([]);
        expect(store.players[1].played).toBe(Sentinel);

        expect(store.players[2].cards).toEqual([]);
        expect(store.players[2].played).toBe(Sentinel);

        expect(store.players[3].cards).toEqual([]);
        expect(store.players[3].played).toBe(Sentinel);

        expect(store.players[0].won).toEqual([]);
        expect(store.players[1].won).toEqual([]);
        expect(store.players[2].won).toEqual(
          expect.arrayContaining([seven, tenSpades, two, ace])
        );
        expect(store.players[3].won).toEqual([]);

        expect(store.played).toEqual(0);
        expect(store.started).toEqual(2);
        expect(store.mode).toEqual(Mode.Playing);
      });
    });

    describe('scores played cards', () => {
      it('scores played cards for a losing bid then bids again', () => {
        const store = useGameStore();
        store.$patch({
          mode: Mode.Score,
          started: 2,
          played: 4,
          trump: Suit.Hearts,
        });

        store.players[0].bid = 3;
        store.players[0].won = [two, six, seven, ace];
        store.players[1].won = [ten, jack, king, queen];

        expect(store.next()).toEqual(true);

        expect(store.redScore).toEqual(-3);
        expect(store.blueScore).toEqual(2);
      });

      it('scores played cards for a matching bid then bids again', () => {
        const store = useGameStore();
        store.$patch({
          mode: Mode.Score,
          started: 2,
          played: 4,
          trump: Suit.Hearts,
        });

        store.players[0].bid = 2;
        store.players[0].won = [two, six, ace];
        store.players[1].won = [ten, king, queen];

        expect(store.next()).toEqual(true);

        expect(store.redScore).toEqual(2);
        expect(store.blueScore).toEqual(1);
      });

      it('scores played cards for a great bid then bids again', () => {
        const store = useGameStore();
        store.$patch({
          mode: Mode.Score,
          started: 2,
          played: 4,
          trump: Suit.Hearts,
        });

        store.players[0].bid = 3;
        store.players[0].won = [two, jack, ace];
        store.players[1].won = [ten, king, queen];

        expect(store.next()).toEqual(true);

        expect(store.redScore).toEqual(3);
        expect(store.blueScore).toEqual(1);
      });
    });
  });
});
