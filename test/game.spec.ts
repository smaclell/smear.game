import { setActivePinia, createPinia } from 'pinia';
import { Mode, useGameStore } from '@/store/game';

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

      expect(store.played).toEqual(0);
      expect(store.active).toEqual(1);

      expect(store.players[0].bid).toEqual(5);
      expect(store.players[1].bid).toEqual(2);
      expect(store.players[2].bid).toEqual(3);
      expect(store.players[3].bid).toEqual(4);

      expect(store.started).toEqual(0);
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

      expect(store.players[1].bid).toEqual(0);
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
});
