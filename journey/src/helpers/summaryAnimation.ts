// Timing for the retro summary intro, shared by the CSS animation, the confetti
// and the vibration so they stay in sync. All times are in seconds.

/** Gap between habit rows starting to fade in. */
const ROW_STEP = 0.1;
/** The count-up starts this long before the last row has finished fading in. */
const ROW_FADE = 0.5;
const ROW_OVERLAP = 0.2;

/** Seconds the first step takes. */
const FIRST_STEP = 0.3;
/** Each step takes this much longer than the one before it. */
const SLOWDOWN = 1.25;
/** The final step is stretched by this much to hold the suspense. */
const FINAL_HOLD = 1.6;
/** The whole count-up never takes longer than this, however many goals there are. */
const MAX_DURATION = 2.5;

/** Seconds a swell takes to build, and to settle back afterwards. */
const SWELL = 0.04;
const SETTLE = 0.2;
/** How much of the full scale a regular swell reaches; the final one and taps reach `FINAL_SWELL`. */
const REGULAR_SWELL = 1;
const FINAL_SWELL = 1.5;
/** Scale added by a swell of 1. */
export const BUMP_SCALE = 0.3;

/**
 * Just before the big swell, the number winds up by shrinking over
 * `WIND_UP_TIME` seconds, as far as `WIND_UP_DEPTH` swells (1 = as far as a
 * regular swell grows it).
 */
const WIND_UP_TIME = 1;
const WIND_UP_DEPTH = 1;

type Stop = [value: number, time: number];

const round = (value: number) => String(+value.toFixed(2));
const seconds = (value: number) => `${String(+value.toFixed(3))}s`;

/** A CSS `linear()` through the stops, always ending on an explicit one. */
const toLinear = (stops: Stop[], total: number) =>
  `linear(0, ${stops
    .map(([value, time]) => `${round(value)} ${round((time / total) * 100)}%`)
    .join(', ')})`;

/** Swells to `peak` at `time`, then settles back to rest. */
const pulse = (
  time: number,
  swell: number,
  settle: number,
  peak: number,
): Stop[] => [
  [0, time - swell],
  [peak, time],
  [peak * 0.3, time + settle * 0.25],
  [0, time + settle],
];

interface Curve {
  /** Seconds. */
  duration: number;
  easing: string;
}

const NONE: Curve = { duration: 0, easing: 'linear' };

/**
 * Swells the number into each tick and lets it settle before the next one. The
 * curve runs until `total`; with `windUp` it ends by shrinking, which the big
 * swell that follows springs out of.
 */
const planNumberBump = (
  ticks: number[],
  total: number,
  windUp: boolean,
): Curve => {
  if (ticks.length === 0 && !windUp) return NONE;

  // The last tick may settle fully, unless the big swell follows right after.
  const afterLast = windUp ? total : Infinity;
  const stops = ticks.flatMap((time, i) => {
    const swell = Math.min(SWELL, i === 0 ? time : (time - ticks[i - 1]) * 0.3);
    const settle = Math.min(SETTLE, ((ticks[i + 1] ?? afterLast) - time) * 0.6);

    return pulse(time, swell, settle, REGULAR_SWELL);
  });

  // linear() extrapolates past its last stop, so the curve must end on an
  // explicit one. Without a wind-up that is where the last tick has settled.
  if (windUp) {
    const lastSettled = (ticks.at(-1) ?? 0) + SETTLE;
    stops.push(
      [0, Math.max(lastSettled, total - WIND_UP_TIME)],
      [-WIND_UP_DEPTH, total],
    );
  }

  return { duration: total, easing: toLinear(stops, total) };
};

/** Swells the whole score at `time`. */
const planScoreBump = (time: number): Curve => {
  const total = time + SETTLE;

  return {
    duration: total,
    easing: toLinear(pulse(time, SWELL, SETTLE, FINAL_SWELL), total),
  };
};

/** The swell played when the score is tapped. */
export const tapBump = planScoreBump(SWELL);

/** Counts through whole numbers, jumping to each on its tick. */
const planCount = (ticks: number[], total: number): Curve => {
  if (ticks.length === 0) return NONE;

  const stops = ticks.flatMap((time, i): Stop[] => [
    [i / ticks.length, time],
    [(i + 1) / ticks.length, time],
  ]);

  return { duration: total, easing: toLinear(stops, total) };
};

export interface SummaryPlan {
  /** Whether every goal was met, which adds the confetti and the big swell. */
  celebrate: boolean;
  /** When the final number lands and the confetti starts, from mount. */
  confettiStart: number;
  /** When each number lands, from mount. */
  ticks: number[];
  /** CSS custom properties that drive the animation. */
  vars: Record<string, string>;
}

/** Plans the intro of a summary with `metCount` of `habitCount` goals met. */
export const planSummary = (
  metCount: number,
  habitCount: number,
): SummaryPlan => {
  const celebrate = habitCount > 0 && metCount === habitCount;
  const delay = habitCount * ROW_STEP + ROW_FADE - ROW_OVERLAP;

  const steps = Array.from(
    { length: metCount },
    (_, i) =>
      FIRST_STEP * SLOWDOWN ** i * (i === metCount - 1 ? FINAL_HOLD : 1),
  );
  const naturalDuration = steps.reduce((sum, step) => sum + step, 0);
  const squeeze = Math.min(1, MAX_DURATION / naturalDuration);
  const duration = naturalDuration * squeeze;

  let elapsed = 0;
  const times = steps.map((step) => {
    elapsed += step * squeeze;

    return elapsed;
  });

  const count = planCount(times, duration);
  // On a celebration the last number is swelled by the whole score instead.
  const numberBump = celebrate
    ? planNumberBump(times.slice(0, -1), duration, true)
    : planNumberBump(times, duration + SETTLE, false);
  const scoreBump = celebrate ? planScoreBump(duration) : NONE;

  return {
    celebrate,
    confettiStart: delay + duration,
    ticks: times.map((time) => delay + time),
    vars: {
      '--bump-scale': String(BUMP_SCALE),
      '--confetti-start': seconds(delay + duration),
      '--count-delay': seconds(delay),
      '--count-duration': seconds(count.duration),
      '--count-easing': count.easing,
      '--number-bump-duration': seconds(numberBump.duration),
      '--number-bump-easing': numberBump.easing,
      '--row-step': seconds(ROW_STEP),
      '--score-bump-duration': seconds(scoreBump.duration),
      '--score-bump-easing': scoreBump.easing,
    },
  };
};
