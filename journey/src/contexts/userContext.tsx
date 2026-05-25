// External
import { createContext, type ReactNode, use, useState } from 'react';

// Utilities
import { getFromLocalStorage } from '../helpers/localStorage';

// Types
import type { User } from '../types/types';

const UserContext = createContext<null | User>(null);
const UserUpdateContext = createContext<(user: null | User) => void>(
  () => null,
);

export const useUser = () => use(UserContext);
export const useUserUpdate = () => use(UserUpdateContext);

type Props = { children: ReactNode };

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<null | User>(() =>
    getFromLocalStorage<User>('user'),
  );

  return (
    <UserContext value={user}>
      <UserUpdateContext value={setUser}>{children}</UserUpdateContext>
    </UserContext>
  );
};
