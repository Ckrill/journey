import { createContext, ReactNode, useContext, useState } from 'react';

// Types
import { User } from '../types/types';

const UserContext = createContext<User | null>(null);
const UserUpdateContext = createContext<(user: User | null) => void>(
  () => null
);

export const useUser = () => useContext(UserContext);
export const useUserUpdate = () => useContext(UserUpdateContext);

type Props = { children: ReactNode };

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={setUser}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
};
