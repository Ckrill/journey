const NETWORK_ERROR = /failed to fetch|load failed|network/i;

const messageOf = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'message' in error &&
  typeof error.message === 'string'
    ? error.message
    : '';

const isNetworkError = (error: unknown) =>
  !navigator.onLine || NETWORK_ERROR.test(messageOf(error));

/** User-facing text for a failed request, distinguishing a lost connection. */
export const errorMessage = (error: unknown) =>
  isNetworkError(error)
    ? "You're offline. Check your connection and try again."
    : 'Something went wrong. Try again.';
