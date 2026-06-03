// External
import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Contexts
import { SettingsProvider } from './contexts/settingsContext';
import { UserProvider } from './contexts/userContext';

// Miscellaneous
import { queryClient } from './lib/queryClient';
import { routeTree } from './routeTree.gen';

// Styles
import './index.css';

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
          <SettingsProvider>
            <RouterProvider router={router} />
          </SettingsProvider>
        </UserProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

void navigator.serviceWorker.register('/sw.js');
