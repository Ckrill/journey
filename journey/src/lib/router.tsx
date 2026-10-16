// External
import { createRouter } from '@tanstack/react-router';

// Miscellaneous
import { routeTree } from '../routeTree.gen';
import { queryClient } from './queryClient';

export const router = createRouter({
  // userId is filled in by <App> once the user is known.
  context: { queryClient, userId: '' },
  defaultErrorComponent: () => <div>Something went wrong</div>,
  defaultPendingComponent: () => <div>Loading...</div>,
  defaultPreload: 'viewport',
  defaultPreloadStaleTime: 0,
  routeTree,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
