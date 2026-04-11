import * as contentful from 'contentful-management';
import { get, getItemsByAttribute } from '../helpers/requests';
import { primeArrayToObject } from '../helpers/dataHandler';
import { settings } from '../settings/settings';
import type { UsersContentful } from '../types/contentfulTypes';
import type { User } from '../types/types';

const client = contentful.createClient({
  accessToken: settings.accessTokenManagement,
});

/** Fetch user by name.
 * @param userName
 * @returns user or null
 */
export const fetchUser = async (userName: string): Promise<User | null> => {
  const response: UsersContentful = await get(
    getItemsByAttribute('user', 'fields.name', userName),
  );

  return primeArrayToObject(response);
};

/**
 * Create and publish user.
 * @param userName
 * @returns user
 */
export const createUser = async (userName: string): Promise<User> => {
  const entry = await client.entry.create(
    {
      spaceId: settings.space,
      environmentId: settings.environment,
      contentTypeId: 'user',
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
      spaceId: settings.space,
      environmentId: settings.environment,
      entryId: entry.sys.id,
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
