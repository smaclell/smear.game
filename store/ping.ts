import * as Tone from 'tone';
import { useGameStore, Mode } from './game';

export function ready() {
  return Tone.start();
}

export function play() {
  // From playing with https://github.com/Tonejs/Tone.js/blob/dev/examples/simpleSynth.html
  const synth = new Tone.Synth({
    oscillator: {
      type: 'amtriangle',
      harmonicity: 0.5,
      modulationType: 'sine',
    },
    envelope: {
      attackCurve: 'exponential',
      attack: 0.05,
      decay: 0.2,
      sustain: 0.2,
      release: 1.5,
    },
    portamento: 0.05,
  }).toDestination();

  synth.triggerAttackRelease('E2', '8n');
}

export function subscribe(store: ReturnType<typeof useGameStore>) {
  store.$subscribe((_, state) => {
    const validMode =
      state.mode === Mode.Playing || state.mode === Mode.Bidding;
    const active = store.active === 0;
    if (validMode && active) {
      play();
    }
  });
}
