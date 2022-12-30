import { storeToRefs } from 'pinia';
import { Mode, useGameStore } from './game';

type StoreType = ReturnType<typeof useGameStore>;

export default function start(store: StoreType): void {
  const { mode, ready } = storeToRefs(store);
  const { next } = store;

  let waiting: NodeJS.Timeout | null = null;

  function clear() {
    waiting = null;
    if (next()) {
      clear();
    }
  }

  function wait() {
    if (waiting || !ready.value || mode.value === Mode.Game) {
      return;
    }

    const delay =
      mode.value === Mode.Score || mode.value === Mode.Bidding ? 4500 : 1500;
    waiting = setTimeout(clear, delay);
  }

  store.$onAction(({ name, after }) => {
    if (name !== 'next') {
      after((result) => {
        result && wait();
      });
    }
  });
}
