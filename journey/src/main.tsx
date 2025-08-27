import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Contexts
import { UserProvider } from './contexts/userContext';
import { EventsProvider } from './contexts/eventsContext';
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
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <UserProvider>
        <EventsProvider>
          <StreakProvider>
            <SettingsProvider>
              <RouterProvider router={router} />
            </SettingsProvider>
          </StreakProvider>
        </EventsProvider>
      </UserProvider>
    </StrictMode>
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
