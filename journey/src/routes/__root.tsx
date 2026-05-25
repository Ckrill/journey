// External
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AnimatePresence } from 'framer-motion';

// Contexts
import { useUser } from '../contexts/userContext';

// Hooks
import { eventsQueryOptions } from '../hooks/useEventsQuery';

// Miscellaneous
import Header from '../components/Header/Header';
import { queryClient } from '../lib/queryClient';
import SignIn from '../screens/SignIn';

// styles
import '../App.scss';

const RootComponent = () => {
  const user = useUser();

  return (
    <>
      {user ? (
        <>
          <Header />

          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </>
      ) : (
        <SignIn />
      )}

      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  loader: async () => {
    await queryClient.ensureQueryData(eventsQueryOptions);
  },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: () => <div>Failed to load events</div>,
  component: RootComponent,
});
