// Types
import type { SummaryPlan } from './summaryAnimation';

// Two short buzzes then a long one reads as "no".
const ERROR_PATTERN = [60, 50, 60, 50, 200];

export const vibrationSupported = 'vibrate' in navigator;

export const vibrateError = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(ERROR_PATTERN);
  }
};

interface Pulse {
  /** Milliseconds from the start of the pattern. */
  at: number;
  duration: number;
}

/** Turns timed pulses into a vibration pattern, merging any that overlap. */
const play = (pulses: Pulse[]) => {
  if (!('vibrate' in navigator) || pulses.length === 0) return;

  const pattern = [0];
  let cursor = 0;
  for (const { at, duration } of pulses.toSorted((a, b) => a.at - b.at)) {
    pattern.push(Math.max(0, at - cursor), duration);
    cursor = Math.max(cursor, at) + duration;
  }

  navigator.vibrate(pattern);
};

// A firm pop followed by flutters that fade out, like confetti settling.
const confettiPulses = (start: number): Pulse[] =>
  [
    { at: 0, duration: 60 },
    { at: 100, duration: 30 },
    { at: 170, duration: 20 },
    { at: 250, duration: 15 },
    { at: 340, duration: 10 },
  ].map((pulse) => ({ ...pulse, at: start + pulse.at }));

const TICK_DURATION = 15;

/** Ticks along with the count-up and, on a celebration, pops with the confetti. */
export const vibrateSummary = ({
  celebrate,
  confettiStart,
  ticks,
}: SummaryPlan) => {
  play([
    ...ticks.map((time) => ({ at: time * 1000, duration: TICK_DURATION })),
    ...(celebrate ? confettiPulses(confettiStart * 1000) : []),
  ]);
};

export const vibrateConfetti = () => {
  play(confettiPulses(0));
};

export const cancelVibration = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(0);
  }
};
