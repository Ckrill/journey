// External
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Contexts
import { AuthProvider } from './contexts/authContext';
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
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AuthGate>
            <SettingsProvider>
              <App />
            </SettingsProvider>
          </AuthGate>
        </QueryClientProvider>
      </AuthProvider>
    </StrictMode>,
  );
}

void navigator.serviceWorker.register('/sw.js');
