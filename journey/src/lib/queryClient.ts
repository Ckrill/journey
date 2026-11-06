// External
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    // Run requests offline so they fail visibly instead of pausing forever.
    mutations: {
      networkMode: 'always',
    },
    queries: {
      networkMode: 'always',
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});
