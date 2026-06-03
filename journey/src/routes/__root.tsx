// External
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AnimatePresence } from 'framer-motion';

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

      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
