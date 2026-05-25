// Miscellaneous
import { parseEvents } from './dataHandler';
import { get, getRecentByType } from './requests';
import { calculateStreak } from './streak';

// Types
import type { EventsContentful } from '../types/contentfulTypes';
import type { User } from '../types/types';

const INITIAL_WINDOW_DAYS = 100;
// Each expansion adds 200 days to the fetch window — balances request count vs coverage.
// A 500-day streak resolves in 3 fetches (100 → 300 → 500).
const WINDOW_EXPANSION = 200;
const MAX_EXPANSIONS = 5;

/** Fetches recent events with expanding window until the streak boundary is found */
export const fetchStreak = async (user: User) => {
  for (let i = 0; i <= MAX_EXPANSIONS; i++) {
    const days = INITIAL_WINDOW_DAYS + WINDOW_EXPANSION * i;
    const data = await get<EventsContentful>(getRecentByType('workout', days));
    const events = parseEvents(data);
    const result = calculateStreak(user, events);

    if (!result.hitBoundary || events.length === 0) {
      return { daysSinceLast: result.daysSinceLast, streak: result.streak };
    }
  }
  return null;
};
