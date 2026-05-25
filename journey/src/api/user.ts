// Settings
import { settings } from '../settings/settings';

// Utilities
import { parseUser } from '../helpers/dataHandler';
import { get, getItemsByAttribute } from '../helpers/requests';

// Miscellaneous
import { client } from './contentful';

// Types
import type { UsersContentful } from '../types/contentfulTypes';
import type { User } from '../types/types';

/** Fetch user by name.
 * @param userName
 * @returns user or null
 */
export const fetchUser = async (userName: string): Promise<null | User> => {
  const response: UsersContentful = await get(
    getItemsByAttribute('user', 'fields.name', userName),
  );

  return parseUser(response);
};

/**
 * Create and publish user.
 * @param userName
 * @returns user
 */
export const createUser = async (userName: string): Promise<User> => {
  const entry = await client.entry.create(
    {
      contentTypeId: 'user',
      environmentId: settings.environment,
      spaceId: settings.space,
    },
    {
      fields: {
        bestStreak: {
          'en-US': 0,
        },
        name: {
          'en-US': userName,
        },
      },
    },
  );

  const publishedEntry = await client.entry.publish(
    {
      entryId: entry.sys.id,
      environmentId: settings.environment,
      spaceId: settings.space,
    },
    entry,
  );

  const user: User = {
    bestStreak: publishedEntry.fields.bestStreak['en-US'],
    id: publishedEntry.sys.id,
    name: publishedEntry.fields.name['en-US'],
  };

  return user;
};
