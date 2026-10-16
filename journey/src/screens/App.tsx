// External
import { RouterProvider } from '@tanstack/react-router';

// Hooks
import { useUserId } from '../hooks/useUserId';

// Miscellaneous
import { router } from '../lib/router';

const App = () => {
  const userId = useUserId();

  return <RouterProvider context={{ userId }} router={router} />;
};

export default App;
