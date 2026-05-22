import * as contentful from 'contentful-management';

// Settings
import { settings } from '../settings/settings';

export const client = contentful.createClient({
  accessToken: settings.accessTokenManagement,
});
