// Settings
import { settings } from '../settings/settings';

const { baseURL, space, environment, accessToken } = settings;

//  Get single entry
export const getItem = (id) => {
  return `${baseURL}/spaces/${space}/environments/${environment}/entries/${id}?access_token=${accessToken}`;
};

// Get entries by type

export const getItemsByType = (type) => {
  return `${baseURL}/spaces/${space}/environments/${environment}/entries?access_token=${accessToken}&content_type=${type}&order=-fields.date`;
};

// Get entries by attribute

export const getItemsByAttribute = (type, attribute, value) => {
  return `${baseURL}/spaces/${space}/environments/${environment}/entries?access_token=${accessToken}&content_type=${type}&${attribute}=${value}`;
};

// Error handling
export const handleResponse = (res) => {
  if (res.status === 200) {
    return res.json();
  } else {
    throw res;
  }
};

// Request a resource
export const get = (url) => {
  return fetch(url).then((res) => handleResponse(res));
};
