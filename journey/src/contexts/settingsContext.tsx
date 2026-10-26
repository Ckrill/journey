// External
import { createContext, type ReactNode, use, useState } from 'react';

// Utilities
import { getFromLocalStorage } from '../helpers/localStorage';

// Types
import type { Settings } from '../types/types';

const defaultSettings: Settings = { sound: true, vibration: true };

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
  const [settings, setSettings] = useState<Settings>(
    () => getFromLocalStorage('settings') ?? defaultSettings,
  );

  return (
    <SettingsContext value={settings}>
      <SettingsUpdateContext value={setSettings}>
        {children}
      </SettingsUpdateContext>
    </SettingsContext>
  );
};
