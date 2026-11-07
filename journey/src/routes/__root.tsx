// External
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AnimatePresence } from 'motion/react';

// Contexts
import { useSettings } from '../contexts/settingsContext';

// Miscellaneous
import Header from '../components/Header/Header';
import Layout from '../components/Layout/Layout';

// styles
import '../App.scss';

const RootComponent = () => {
  const { bottomNavigation } = useSettings();

  return (
    <>
      <HeadContent />

      <Layout>
        <AnimatePresence initial={false} mode="wait">
          <Header
            bottomNavigation={bottomNavigation}
            key={String(bottomNavigation)}
          />
        </AnimatePresence>

        <main>
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </Layout>

      <ReactQueryDevtools />

      <TanStackRouterDevtools />
    </>
  );
};

interface RouterContext {
  queryClient: QueryClient;
  userId: string;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  head: () => ({ meta: [{ title: 'Journey' }] }),
});
