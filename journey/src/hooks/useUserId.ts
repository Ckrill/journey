// Contexts
import { useSession } from '../contexts/authContext';

/** The signed-in user's id. Only call inside AuthGate. */
export const useUserId = () => {
  const session = useSession();
  if (!session) throw new Error('useUserId must be used while signed in');
  return session.user.id;
};
