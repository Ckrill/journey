import { createContext, type ReactNode, use, useState } from 'react';

// Types
import type { User } from '../types/types';

const UserContext = createContext<User | null>(null);
const UserUpdateContext = createContext<(user: User | null) => void>(
  () => null,
);

export const useUser = () => use(UserContext);
export const useUserUpdate = () => use(UserUpdateContext);

type Props = { children: ReactNode };

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext value={user}>
      <UserUpdateContext value={setUser}>{children}</UserUpdateContext>
    </UserContext>
  );
};
