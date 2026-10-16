// External
import { useQuery } from '@tanstack/react-query';
import { createContext, type ReactNode, use } from 'react';

// API
import { createUser, fetchUser } from '../api/user';

// Types
import type { User } from '../types/types';

const UserContext = createContext<null | User>(null);

/** The Contentful user for the signed-in Clerk account. */
export const useUser = () => {
  const user = use(UserContext);
  if (!user) throw new Error('useUser must be used inside UserProvider');
  return user;
};

interface Props {
  children: ReactNode;
  clerkId: string;
  name: string;
}

export const UserProvider = ({ children, clerkId, name }: Props) => {
  const { data, isError } = useQuery({
    queryFn: async () =>
      (await fetchUser(clerkId)) ?? createUser(clerkId, name),
    queryKey: ['user', clerkId, name],
    staleTime: Infinity,
  });

  if (isError) return <div>Something went wrong</div>;
  if (!data) return null;

  return <UserContext value={data}>{children}</UserContext>;
};
