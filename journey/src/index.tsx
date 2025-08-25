import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Contexts
import { UserProvider } from './contexts/userContext';
import { EventsProvider } from './contexts/eventsContext';
import { StreakProvider } from './contexts/streakContext';
import { SettingsProvider } from './contexts/settingsContext';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <UserProvider>
      <EventsProvider>
        <StreakProvider>
          <SettingsProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SettingsProvider>
        </StreakProvider>
      </EventsProvider>
    </UserProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
