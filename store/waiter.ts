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

    let delay = 1500;
    if (mode.value === Mode.Score || mode.value === Mode.Bidding) {
      delay = 4500;
    } else if (mode.value === Mode.Playing) {
      delay = 2000;
    }
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
