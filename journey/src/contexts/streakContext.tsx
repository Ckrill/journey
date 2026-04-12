import { createContext, type ReactNode, use, useState } from 'react';

const StreakContext = createContext<{
  leniency: number;
  streak: number;
}>({ leniency: 0, streak: -1 });
const StreakUpdateContext = createContext<
  (streak: { leniency: number; streak: number }) => void
>(() => null);

export const useStreak = () => use(StreakContext);
export const useStreakUpdate = () => use(StreakUpdateContext);

type Props = { children: ReactNode };

export const StreakProvider = ({ children }: Props) => {
  const [streak, setStreak] = useState<{
    leniency: number;
    streak: number;
  }>({ leniency: 0, streak: -1 });

  return (
    <StreakContext value={streak}>
      <StreakUpdateContext value={setStreak}>{children}</StreakUpdateContext>
    </StreakContext>
  );
};
