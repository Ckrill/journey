// External
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
  const session = useSession();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);

    // Stop a signed out user on this device from receiving reminders.
    if (pushSupported) await disablePush().catch(() => undefined);
    const { error } = await supabase.auth.signOut();

    // On success the page unmounts, so only a failure needs the button back.
    if (error) setSigningOut(false);
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

      <ButtonGroup>
        <Button
          onClick={() => {
            setPasswordSaved(false);
            setPasswordOpen(true);
          }}
        >
          {passwordSaved ? 'Password changed' : 'Change password'}
        </Button>

        <Button
          disabled={signingOut}
          onClick={() => {
            void handleSignOut();
          }}
          priority="secondary"
        >
          {signingOut ? 'Signing out' : 'Sign out'}
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
