import * as Tone from 'tone';
import { useGameStore, Mode } from './game';

export function ready() {
  return Tone.start();
}

export function play() {
  // From playing with https://tonejs.github.io/examples/monoSynth
  const synth = new Tone.PolySynth(Tone.MonoSynth, {
    volume: -8,
    oscillator: {
      type: 'square8',
    },
    envelope: {
      attack: 0.05,
      decay: 0.3,
      sustain: 0.4,
      release: 0.8,
    },
    filterEnvelope: {
      attack: 0.001,
      decay: 0.7,
      sustain: 0.1,
      release: 0.8,
      baseFrequency: 300,
      octaves: 4,
    },
  }).toDestination();

  synth.triggerAttackRelease('F6', '8n');
}

export function subscribe(store: ReturnType<typeof useGameStore>) {
  const run = () => {
    const validMode =
      store.mode === Mode.Playing || store.mode === Mode.Bidding;
    const active = store.active === 0;
    if (validMode && active) {
      play();
    }
  };

  run();

  store.$subscribe(() => {
    run();
  });
}
