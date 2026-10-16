// External
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AnimatePresence } from 'motion/react';

// Miscellaneous
import Header from '../components/Header/Header';

// styles
import '../App.scss';

const RootComponent = () => {
  return (
    <>
      <Header />

      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>

      <ReactQueryDevtools />

      <TanStackRouterDevtools />
    </>
  );
};

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});
