// External
import { createContext, type ReactNode, use, useState } from 'react';

// Utilities
import { getFromLocalStorage } from '../helpers/localStorage';

const SettingsContext = createContext<{
  birthYear?: number;
  sound: boolean;
  vibration: boolean;
}>({ birthYear: undefined, sound: true, vibration: true });
const SettingsUpdateContext = createContext<
  (settings: { birthYear?: number; sound: boolean; vibration: boolean }) => void
>(() => null);

export const useSettings = () => use(SettingsContext);
export const useSettingsUpdate = () => use(SettingsUpdateContext);

interface Props {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: Props) => {
  const [settings, setSettings] = useState<{
    birthYear?: number;
    sound: boolean;
    vibration: boolean;
  }>(
    () =>
      getFromLocalStorage('settings') ?? {
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
