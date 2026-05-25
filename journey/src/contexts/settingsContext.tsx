// External
import { createContext, type ReactNode, use, useState } from 'react';

// Utilities
import { getFromLocalStorage } from '../helpers/localStorage';

// Types
import type { Settings } from '../types/types';

const SettingsContext = createContext<{
  sound: boolean;
  vibration: boolean;
}>({ sound: true, vibration: true });
const SettingsUpdateContext = createContext<
  (settings: { sound: boolean; vibration: boolean }) => void
>(() => null);

export const useSettings = () => use(SettingsContext);
export const useSettingsUpdate = () => use(SettingsUpdateContext);

type Props = { children: ReactNode };

export const SettingsProvider = ({ children }: Props) => {
  const [settings, setSettings] = useState<{
    sound: boolean;
    vibration: boolean;
  }>(
    () =>
      getFromLocalStorage<Settings>('settings') || {
        sound: true,
        vibration: true,
      },
  );

  return (
    <SettingsContext value={settings}>
      <SettingsUpdateContext value={setSettings}>
        {children}
      </SettingsUpdateContext>
    </SettingsContext>
  );
};
