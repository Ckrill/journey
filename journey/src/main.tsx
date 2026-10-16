// External
import { ClerkProvider } from '@clerk/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Settings
import { clerkAppearance } from './settings/clerkAppearance';

// Contexts
import { SettingsProvider } from './contexts/settingsContext';

// Miscellaneous
import { queryClient } from './lib/queryClient';
import App from './screens/App';
import AuthGate from './screens/AuthGate';

// Styles
import './index.css';

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
              <App />
            </SettingsProvider>
          </AuthGate>
        </QueryClientProvider>
      </ClerkProvider>
    </StrictMode>,
  );
}

void navigator.serviceWorker.register('/sw.js');
