// Settings
import { settings } from '../settings/settings';

// API
import { client } from '../api/contentful';

const deleteEntry = (
  entryId: string,
  callback: () => void,
  errorCallback: () => void,
) => {
  const params = {
    spaceId: settings.space,
    environmentId: settings.environment,
    entryId,
  };

  client.entry
    .get(params)
    .then((entry) => client.entry.unpublish(params, entry))
    .then(() => client.entry.delete(params))
    .then(callback)
    .catch((error) => {
      errorCallback();
      console.error(error);
    });
};

export default deleteEntry;
