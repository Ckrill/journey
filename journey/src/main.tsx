// External
import { ClerkProvider } from '@clerk/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Settings
import { clerkAppearance } from './settings/clerkAppearance';

// Contexts
import { SettingsProvider } from './contexts/settingsContext';

// Miscellaneous
import { queryClient } from './lib/queryClient';
import { routeTree } from './routeTree.gen';
import AuthGate from './screens/AuthGate';

// Styles
import './index.css';

// Create a new router instance
const router = createRouter({
  context: { queryClient },
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

// Render the app
const rootElement = document.getElementById('root');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ClerkProvider afterSignOutUrl="/" appearance={clerkAppearance}>
        <QueryClientProvider client={queryClient}>
          <AuthGate>
            <SettingsProvider>
              <RouterProvider router={router} />
            </SettingsProvider>
          </AuthGate>
        </QueryClientProvider>
      </ClerkProvider>
    </StrictMode>,
  );
}

void navigator.serviceWorker.register('/sw.js');
