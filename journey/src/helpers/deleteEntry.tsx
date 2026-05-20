// Settings
import { settings } from '../settings/settings';

// API
import { client } from '../api/contentful';

const deleteEntry = async (
  entryId: string,
  callback: () => void,
  errorCallback: () => void,
) => {
  const params = {
    spaceId: settings.space,
    environmentId: settings.environment,
    entryId,
  };

  try {
    const entry = await client.entry.get(params);
    await client.entry.unpublish(params, entry);
    await client.entry.delete(params);
    callback();
  } catch (error) {
    errorCallback();
    console.error(error);
  }
};

export default deleteEntry;
