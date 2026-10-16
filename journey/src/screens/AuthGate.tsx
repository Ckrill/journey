// External
import type { ReactNode } from 'react';

// Contexts
import { useSession } from '../contexts/authContext';

// Miscellaneous
import SignIn from './SignIn';

const AuthGate = ({ children }: { children: ReactNode }) => {
  const session = useSession();

  if (session === undefined) return <div>Authenticating...</div>;
  if (!session) return <SignIn />;

  return <>{children}</>;
};

export default AuthGate;
