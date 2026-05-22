import { client } from '../api/contentful';
import { settings } from '../settings/settings';
import type { User } from '../types/types';

/** Persists currentStreak and streakUpdatedDate (and bestStreak if new record) to Contentful */
export const persistStreak = async (user: User, streakValue: number) => {
  const today = Temporal.Now.plainDateISO().toString();
  const isNewBest = streakValue > (user.bestStreak ?? 0);

  const entryParams = {
    spaceId: settings.space,
    environmentId: settings.environment,
    entryId: user.id,
  };

  const currentEntry = await client.entry.get(entryParams);

  type EntryFields = Record<string, Record<string, unknown>>;
  const fields = currentEntry.fields as EntryFields;
  fields.currentStreak = { 'en-US': streakValue };
  fields.streakUpdatedDate = { 'en-US': today };
  if (isNewBest) {
    fields.bestStreak = { 'en-US': streakValue };
  }

  const updatedEntry = await client.entry.update(entryParams, {
    ...currentEntry,
    fields,
  });
  await client.entry.publish(entryParams, updatedEntry);

  return { isNewBest, today };
};
