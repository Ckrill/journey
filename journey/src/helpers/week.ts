/** Day labels in ISO order (Monday first). */
export const WEEKDAY_LABELS = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
] as const;

/** Today's ISO calendar date (YYYY-MM-DD), device-local. */
export const today = () => Temporal.Now.plainDateISO().toString();

/** Returns the Monday (ISO week start) of the week containing the given date. */
export const weekStartOf = (date: string): string => {
  const plain = Temporal.PlainDate.from(date);
  // dayOfWeek: Monday = 1 … Sunday = 7
  return plain.subtract({ days: plain.dayOfWeek - 1 }).toString();
};

/** Monday of the current week, device-local. */
export const currentWeekStart = () => weekStartOf(today());

/** Shifts a week-start by the given number of weeks (negative = past). */
export const shiftWeek = (weekStart: string, weeks: number): string => {
  return Temporal.PlainDate.from(weekStart).add({ weeks }).toString();
};

/** The seven ISO dates (Mon→Sun) for the week starting at `weekStart`. */
export const weekDates = (weekStart: string): string[] => {
  const monday = Temporal.PlainDate.from(weekStart);
  return Array.from({ length: 7 }, (_, i) =>
    monday.add({ days: i }).toString(),
  );
};

/** ISO week number (1–53) for the week starting at `weekStart`. */
export const weekNumber = (weekStart: string): number =>
  Temporal.PlainDate.from(weekStart).weekOfYear ?? 0;

/** Human label for a week, e.g. "June 15 — June 21". */
export const formatWeekRange = (weekStart: string): string => {
  const start = Temporal.PlainDate.from(weekStart);
  const end = start.add({ days: 6 });
  const locale = 'en-US';
  const fmt = (d: Temporal.PlainDate) =>
    new Date(d.toString()).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    });
  return `${fmt(start)} — ${fmt(end)}`;
};

/** Groups event dates into ISO-week buckets keyed by their Monday. */
export const countEventsPerWeek = (dates: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const date of dates) {
    const week = weekStartOf(date);
    counts.set(week, (counts.get(week) ?? 0) + 1);
  }
  return counts;
};
