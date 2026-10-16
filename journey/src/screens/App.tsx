// External
import { RouterProvider } from '@tanstack/react-router';

// Contexts
import { useUser } from '../contexts/userContext';

// Miscellaneous
import { router } from '../lib/router';

const App = () => {
  const user = useUser();

  return <RouterProvider context={{ userId: user.id }} router={router} />;
};

export default App;
