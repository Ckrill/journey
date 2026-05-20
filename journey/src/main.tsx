import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './index.css';

// Contexts
import { UserProvider } from './contexts/userContext';
import { EventsProvider } from './contexts/eventsContext';
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
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <UserProvider>
        <EventsProvider>
          <SettingsProvider>
            <RouterProvider router={router} />
          </SettingsProvider>
        </EventsProvider>
      </UserProvider>
    </StrictMode>,
  );
}

navigator.serviceWorker.register('/sw.js');
