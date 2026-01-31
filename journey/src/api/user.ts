import * as contentful from 'contentful-management';
import { get, getItemsByAttribute } from '../helpers/requests';
import { primeArrayToObject } from '../helpers/dataHandler';
import { settings } from '../settings/settings';
import { UsersContentful } from '../types/contentfulTypes';
import { User } from '../types/types';

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
  const space = await client.getSpace(settings.space);
  const environment = await space.getEnvironment(settings.environment);
  const entry = await environment.createEntry('user', {
    fields: {
      bestStreak: {
        'en-US': 0,
      },
      name: {
        'en-US': userName,
      },
    },
  });
  const publishedEntry = await entry.publish();

  const user: User = {
    bestStreak: publishedEntry.fields.bestStreak['en-US'],
    id: publishedEntry.sys.id,
    name: publishedEntry.fields.name['en-US'],
  };

  return user;
};
