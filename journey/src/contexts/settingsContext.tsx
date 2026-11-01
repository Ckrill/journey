// External
import { createContext, type ReactNode, use, useState } from 'react';

// Utilities
import { getFromLocalStorage, settingsKey } from '../helpers/localStorage';

// Hooks
import { useUserId } from '../hooks/useUserId';

// Types
import type { Settings } from '../types/types';

const defaultSettings: Settings = {
  notifications: false,
  sound: true,
  vibration: true,
};

const SettingsContext = createContext<Settings>(defaultSettings);
const SettingsUpdateContext = createContext<(settings: Settings) => void>(
  () => null,
);

export const useSettings = () => use(SettingsContext);
export const useSettingsUpdate = () => use(SettingsUpdateContext);

interface Props {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: Props) => {
  const userId = useUserId();
  const [settings, setSettings] = useState<Settings>(() => ({
    ...defaultSettings,
    ...getFromLocalStorage(settingsKey(userId)),
  }));

  return (
    <SettingsContext value={settings}>
      <SettingsUpdateContext value={setSettings}>
        {children}
      </SettingsUpdateContext>
    </SettingsContext>
  );
};
