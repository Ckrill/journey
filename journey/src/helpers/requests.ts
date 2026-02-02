// Settings
import { settings } from '../settings/settings';

// Types
import { ArrayContentful } from '../types/contentfulTypes';

const { baseURL, limit, space, environment, accessToken } = settings;

//  Get single entry
export const getItem = (id: string) => {
  return `${baseURL}/spaces/${space}/environments/${environment}/entries/${id}?access_token=${accessToken}`;
};

// Get entries by type
export const getItemsByType = (type: string, skip: number) => {
  return `${baseURL}/spaces/${space}/environments/${environment}/entries?access_token=${accessToken}&content_type=${type}&order=-fields.date&limit=${limit}&skip=${skip}`;
};

// Get entries by attribute
export const getItemsByAttribute = (
  type: string,
  attribute: string,
  value: string,
) => {
  return `${baseURL}/spaces/${space}/environments/${environment}/entries?access_token=${accessToken}&content_type=${type}&${attribute}=${value}`;
};

type ResponseType = {
  json: () => Promise<ArrayContentful>;
  status: number;
};

// Error handling
export const handleResponse = (res: ResponseType) => {
  if (res.status === 200) {
    return res.json();
  } else {
    throw res;
  }
};

// Request a resource
export const get = (url: string) => {
  return fetch(url).then((res) => handleResponse(res));
};
