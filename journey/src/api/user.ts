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

/** Fetch user by Clerk id.
 * @param clerkId
 * @returns user or null
 */
export const fetchUser = async (clerkId: string): Promise<null | User> => {
  const response: UsersContentful = await get(
    getItemsByAttribute('user', 'fields.clerkId', clerkId),
  );

  return parseUser(response);
};

/**
 * Create and publish user.
 * @param clerkId auth id
 * @param userName display name
 * @returns user
 */
export const createUser = async (
  clerkId: string,
  userName: string,
): Promise<User> => {
  const entry = await client.entry.create(
    {
      contentTypeId: 'user',
      environmentId: settings.environment,
      spaceId: settings.space,
    },
    {
      fields: {
        clerkId: {
          'en-US': clerkId,
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
    id: publishedEntry.sys.id,
    name: publishedEntry.fields.name['en-US'],
  };

  return user;
};
