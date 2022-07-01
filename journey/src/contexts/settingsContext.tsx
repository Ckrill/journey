import { createContext, ReactNode, useContext, useState } from 'react';

const SettingsContext = createContext<{
  sound: boolean;
  vibration: boolean;
}>({ sound: true, vibration: true });
const SettingsUpdateContext = createContext<
  (settings: { sound: boolean; vibration: boolean }) => void
>(() => null);

export const useSettings = () => useContext(SettingsContext);
export const useSettingsUpdate = () => useContext(SettingsUpdateContext);

type Props = { children: ReactNode };

export const SettingsProvider = ({ children }: Props) => {
  const [settings, setSettings] = useState<{
    sound: boolean;
    vibration: boolean;
  }>({ sound: true, vibration: true });

  return (
    <SettingsContext.Provider value={settings}>
      <SettingsUpdateContext.Provider value={setSettings}>
        {children}
      </SettingsUpdateContext.Provider>
    </SettingsContext.Provider>
  );
};
