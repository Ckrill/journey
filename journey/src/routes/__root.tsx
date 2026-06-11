// External
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AnimatePresence } from 'motion/react';

// Contexts
import { useUser } from '../contexts/userContext';

// Miscellaneous
import Header from '../components/Header/Header';
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

      <ReactQueryDevtools />

      <TanStackRouterDevtools />
    </>
  );
};

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});
