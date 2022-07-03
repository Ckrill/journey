import * as contentful from 'contentful-management';

// Settings
import { settings } from '../settings/settings';

const client = contentful.createClient({
  accessToken:
    process.env.REACT_APP_CONTENTFUL_USER ||
    settings.accessTokenManagement ||
    '',
});

const deleteEntry = (
  entryId: string,
  callback: () => void,
  errorCallback: () => void
) => {
  client
    .getSpace(settings.space)
    .then((space) => space.getEnvironment(settings.environment))
    .then((environment) => environment.getEntry(entryId))
    .then((entry) => entry.unpublish())
    .then((entry) => entry.delete())
    .then(callback)
    .catch((error) => {
      errorCallback();
      console.error(error);
    });
};

export default deleteEntry;
