import { createContext, ReactNode, useContext, useState } from 'react';

const StreakContext = createContext<{
  leniency: number;
  streak: number;
}>({ leniency: 0, streak: -1 });
const StreakUpdateContext = createContext<
  (streak: { leniency: number; streak: number }) => void
>(() => null);

export const useStreak = () => useContext(StreakContext);
export const useStreakUpdate = () => useContext(StreakUpdateContext);

type Props = { children: ReactNode };

export const StreakProvider = ({ children }: Props) => {
  const [streak, setStreak] = useState<{
    leniency: number;
    streak: number;
  }>({ leniency: 0, streak: -1 });

  return (
    <StreakContext.Provider value={streak}>
      <StreakUpdateContext.Provider value={setStreak}>
        {children}
      </StreakUpdateContext.Provider>
    </StreakContext.Provider>
  );
};
