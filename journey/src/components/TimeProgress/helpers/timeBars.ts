// Types
import type { Habit, Habits } from '../../../types/types';

export type BarKind = 'finite' | 'infinite' | 'time';

interface Bar {
  detail: {
    elapsed: number;
    total: null | number;
  };
  id: string;
  kind: BarKind;
  label: string;
  progress: number;
}

const LIFE_YEARS = 80;

const getProgress = (ticks: number, elapsed: number) =>
  Math.min(Math.max((elapsed / ticks) * 100, 0), 100);

const getHabitStart = (createdAt: string) =>
  Temporal.Instant.from(createdAt)
    .toZonedDateTimeISO(Temporal.Now.timeZoneId())
    .toPlainDate();

// Completed months since start.
const getMonths = (start: Temporal.PlainDate) =>
  start.until(Temporal.Now.plainDateISO(), { largestUnit: 'months' }).months;

const getRangeProgress = (start: Temporal.PlainDate, end: Temporal.PlainDate) =>
  getProgress(
    start.until(end, { largestUnit: 'days' }).days,
    start.until(Temporal.Now.plainDateISO(), { largestUnit: 'days' }).days,
  );

// Habits without an estimated time to goal never end, so their bar is full.
const toHabitBar = (habit: Habit): Bar => {
  const start = getHabitStart(habit.createdAt);

  return {
    detail: {
      elapsed: getMonths(start),
      total: habit.goalMonths,
    },
    id: habit.id,
    kind: habit.goalMonths === null ? 'infinite' : 'finite',
    label: habit.name,
    progress:
      habit.goalMonths === null
        ? 100
        : getRangeProgress(start, start.add({ months: habit.goalMonths })),
  };
};

// Year and life are fixed spans, so they have a known total.
const toTimeBar = (
  id: string,
  label: string,
  start: Temporal.PlainDate,
  duration: Temporal.DurationLike,
): Bar => {
  const end = start.add(duration);

  return {
    detail: {
      elapsed: getMonths(start),
      total: start.until(end, { largestUnit: 'months' }).months,
    },
    id,
    kind: 'time',
    label,
    progress: getRangeProgress(start, end),
  };
};

/** Habits (least progressed first), then the year, then life if a birth year is set. */
export const getTimeBars = (habits: Habits, birthYear?: number): Bar[] => {
  const habitBars = habits
    .map((habit) => toHabitBar(habit))
    .toSorted((a, b) => a.progress - b.progress);

  const timeBars = [
    toTimeBar(
      'year',
      'Year',
      Temporal.Now.plainDateISO().with({ day: 1, month: 1 }),
      {
        years: 1,
      },
    ),
    ...(birthYear
      ? [
          toTimeBar(
            'life',
            'Life',
            Temporal.PlainDate.from({ day: 1, month: 1, year: birthYear }),
            { years: LIFE_YEARS },
          ),
        ]
      : []),
  ];

  return [...habitBars, ...timeBars];
};
