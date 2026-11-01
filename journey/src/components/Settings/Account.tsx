// External
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

// Utilities
import { disablePush, pushSupported } from '../../helpers/push';

// Contexts
import { useSession } from '../../contexts/authContext';

// Miscellaneous
import { supabase } from '../../lib/supabase';
import Button from '../Button/Button';
import ButtonGroup from '../Button/ButtonGroup';
import ChangePasswordModal from '../ChangePassword/ChangePasswordModal';
import Input from '../Form/Input/Input';
import Heading from '../Heading/Heading';

const Account = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleSignOut = async () => {
    // Stop a signed out user on this device from receiving reminders.
    if (pushSupported) await disablePush().catch(() => undefined);
    await supabase.auth.signOut();
    // Drop cached data so the next account never sees this one's.
    queryClient.clear();
  };

  useEffect(() => {
    if (!passwordSaved) return;

    const timeout = setTimeout(() => {
      setPasswordSaved(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [passwordSaved]);

  return (
    <>
      <Heading>Account</Heading>

      <Input
        disabled
        id="email"
        labelText="Email"
        type="email"
        value={session?.user.email ?? ''}
      />

      <ButtonGroup
        align="center"
        assistiveText="Signing out will pause your notifications on this device."
      >
        <Button
          onClick={() => {
            setPasswordSaved(false);
            setPasswordOpen(true);
          }}
        >
          {passwordSaved ? 'Password changed' : 'Change password'}
        </Button>

        <Button
          onClick={() => {
            void handleSignOut();
          }}
          priority="secondary"
        >
          Sign out
        </Button>
      </ButtonGroup>

      <ChangePasswordModal
        onClose={() => {
          setPasswordOpen(false);
        }}
        onSaved={() => {
          setPasswordOpen(false);
          setPasswordSaved(true);
        }}
        open={passwordOpen}
      />
    </>
  );
};

export default Account;
