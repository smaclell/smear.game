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
    if (waiting || !ready.value) {
      return;
    }

    let delay = 0;
    if (mode.value === Mode.Playing) {
      delay = 2000;
    } else if (mode.value === Mode.Bidding) {
      delay = 500;
    }

    if (delay > 0) {
      waiting = setTimeout(clear, delay);
    }
  }

  store.$onAction(({ name, after }) => {
    if (name !== 'next') {
      after((result) => {
        result && wait();
      });
    }
  });
}
