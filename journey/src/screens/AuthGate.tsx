// External
import { useUser } from '@clerk/react';
import type { ReactNode } from 'react';

// Contexts
import { UserProvider } from '../contexts/userContext';

// Miscellaneous
import SignIn from './SignIn';

const AuthGate = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return <div>Authenticating...</div>;
  if (!isSignedIn) return <SignIn />;

  return (
    <UserProvider
      clerkId={user.id}
      name={user.firstName ?? user.username ?? 'friend'}
    >
      {children}
    </UserProvider>
  );
};

export default AuthGate;
