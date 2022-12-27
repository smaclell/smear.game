import { setActivePinia, createPinia } from 'pinia';
import { Mode, useGameStore } from '@/store/game';
import { Card, Suit } from '~/CardTypes';

describe('store/game', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
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

      expect(store.dealer).toEqual(0);
      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.bid(1, 2)).toBe(true);

      expect(store.played).toEqual(1);
      expect(store.active).toEqual(2);

      expect(store.players[1].bid).toEqual(2);
    });

    it('can bid for all player', () => {
      const store = setup();

      expect(store.dealer).toEqual(0);
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

      expect(store.started).toEqual(0);
      expect(store.active).toEqual(0);
      expect(store.played).toEqual(0);
      expect(store.mode).toEqual(Mode.Playing);
    });

    it('cannot bid for the wrong player', () => {
      const store = setup();

      expect(store.dealer).toEqual(0);
      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.bid(2, 2)).toBe(false);

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.players[1].bid).toBeUndefined();
    });

    it('cannot bid while playing', () => {
      const store = setup();
      store.$patch({ mode: Mode.Playing });

      expect(store.dealer).toEqual(0);
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

      const two: Card = { suit: Suit.Hearts, value: 2 };

      store.players[1].cards = [two];
      expect(store.players[1].played).toBeUndefined();

      expect(store.trump).toBeUndefined();

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

      const two: Card = { suit: Suit.Hearts, value: 2 };
      const ace: Card = { suit: Suit.Hearts, value: 14 };
      const ten: Card = { suit: Suit.Hearts, value: 10 };
      const seven: Card = { suit: Suit.Spades, value: 7 };

      store.players[0].cards = [seven];
      expect(store.players[0].played).toBeUndefined();

      store.players[1].cards = [two];
      expect(store.players[1].played).toBeUndefined();

      store.players[2].cards = [ten];
      expect(store.players[2].played).toBeUndefined();

      store.players[3].cards = [ace];
      expect(store.players[3].played).toBeUndefined();

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
    });

    it('only play once', () => {
      const store = useGameStore();
      store.$patch({
        mode: Mode.Playing,
      });

      const two: Card = { suit: Suit.Hearts, value: 2 };

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

      const two: Card = { suit: Suit.Hearts, value: 2 };
      const three: Card = { suit: Suit.Hearts, value: 3 };

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

      const two: Card = { suit: Suit.Hearts, value: 2 };
      const three: Card = { suit: Suit.Hearts, value: 3 };

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

      const two: Card = { suit: Suit.Hearts, value: 2 };

      store.players[1].cards = [two];

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.play(1, two)).toBe(false);

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);
    });
  });
});
