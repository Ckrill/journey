// External
import type { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'motion/react';
import { type ReactNode, useEffect, useState } from 'react';

// Contexts
import { AuthContext, useSession } from '../contexts/authContext';

// Miscellaneous
import SignIn from './SignIn';

const AuthGate = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const session = useSession();
  // Kept after sign-out so the app stays visible while the sign in page fades in.
  const [retainedSession, setRetainedSession] = useState<null | Session>(null);

  if (session && session !== retainedSession) setRetainedSession(session);

  useEffect(() => {
    // Drop cached data so the next account never sees this one's.
    if (!retainedSession) queryClient.clear();
  }, [retainedSession, queryClient]);

  return (
    <>
      {retainedSession && (
        <AuthContext value={retainedSession}>{children}</AuthContext>
      )}

      <AnimatePresence>
        {!session && (
          <SignIn
            key="sign-in"
            onCovered={() => {
              setRetainedSession(null);
            }}
            restoringSession={session === undefined}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AuthGate;
