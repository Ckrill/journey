// External
import type { Session } from '@supabase/supabase-js';
import { createContext, type ReactNode, use, useEffect, useState } from 'react';

// Miscellaneous
import { supabase } from '../lib/supabase';

// undefined while the stored session is still being read, null when signed out.
const AuthContext = createContext<null | Session | undefined>(undefined);

export const useSession = () => use(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<null | Session | undefined>(undefined);

  useEffect(() => {
    // Fires once with the stored session, then on every sign-in/out.
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext value={session}>{children}</AuthContext>;
};
