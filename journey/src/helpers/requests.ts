// Settings
import { settings } from '../settings/settings';

// Types
import type { ArrayContentful } from '../types/contentfulTypes';

const { accessToken, baseURL, environment, limit, space } = settings;

//  Get single entry
// export const getItem = (id: string) => {
//   return `${baseURL}/spaces/${space}/environments/${environment}/entries/${id}?access_token=${accessToken}`;
// };

// Get entries by type
export const getItemsByType = (type: string, skip: number) => {
  return `${baseURL}/spaces/${space}/environments/${environment}/entries?access_token=${accessToken}&content_type=${type}&order=-fields.date&limit=${String(limit)}&skip=${String(skip)}`;
};

// Get recent entries by type (date-filtered)
export const getRecentByType = (type: string, days: number) => {
  const since = Temporal.Now.plainDateISO()
    .subtract({ days })
    .toString();
  return `${baseURL}/spaces/${space}/environments/${environment}/entries?access_token=${accessToken}&content_type=${type}&order=-fields.date&fields.date[gte]=${since}&limit=100`;
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
const handleResponse = (res: ResponseType) => {
  if (res.status === 200) {
    return res.json();
  } else {
    throw new Error(`Request failed with status ${String(res.status)}`);
  }
};

// Request a resource
export const get = <T = ArrayContentful>(url: string): Promise<T> => {
  return fetch(url, { signal: AbortSignal.timeout(5_000) }).then((res) =>
    handleResponse(res),
  ) as Promise<T>;
};

// Fetch all pages for a content type in parallel
export const getAll = async <T extends ArrayContentful>(
  type: string,
): Promise<T> => {
  // First page reveals total item count
  const first = await get<T>(getItemsByType(type, 0));

  if (first.items.length >= first.total) return first;

  // Fire remaining page requests in parallel
  const remainingPages = Math.ceil((first.total - limit) / limit);
  const requests = Array.from({ length: remainingPages }, (_, i) =>
    get<T>(getItemsByType(type, (i + 1) * limit)),
  );

  const pages = await Promise.all(requests);

  // Merge items and linked entries from all pages
  const result = { ...first };
  result.items = [...first.items, ...pages.flatMap((page) => page.items)];

  if (first.includes?.Entry) {
    result.includes = {
      Entry: [
        ...first.includes.Entry,
        ...pages.flatMap((page) => page.includes?.Entry ?? []),
      ],
    };
  }

  return result;
};
