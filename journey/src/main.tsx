import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './index.css';

// Query
import { queryClient } from './lib/queryClient';

// Contexts
import { UserProvider } from './contexts/userContext';
import { StreakProvider } from './contexts/streakContext';
import { SettingsProvider } from './contexts/settingsContext';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('root');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <StreakProvider>
            <SettingsProvider>
              <RouterProvider router={router} />
            </SettingsProvider>
          </StreakProvider>
        </UserProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

void navigator.serviceWorker.register('/sw.js');
