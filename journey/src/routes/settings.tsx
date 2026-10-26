// External
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

// Settings
import { pageTransition, pageVariants } from '../settings/pageTransition';

// Utilities
import { saveToLocalStorage } from '../helpers/localStorage';

// Contexts
import { useSettings } from '../contexts/settingsContext';

// Hooks
import { eventsQueryOptions } from '../hooks/useEventsQuery';
import { habitsQueryOptions } from '../hooks/useHabitsQuery';

// Miscellaneous
import Button from '../components/Button/Button';
import ChangePasswordModal from '../components/ChangePassword/ChangePasswordModal';
import DeleteAccountModal from '../components/DeleteAccount/DeleteAccountModal';
import Divider from '../components/Divider/Divider';
import DownloadDataButton from '../components/DownloadData/DownloadDataButton';
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Preferences from '../components/Preferences/Preferences';
import Profile from '../components/Profile/Profile';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import { supabase } from '../lib/supabase';

const Settings = () => {
  const queryClient = useQueryClient();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const settings = useSettings();

  const handleSignOut = async () => {
    localStorage.clear();
    await supabase.auth.signOut();
    // Drop cached data so the next account never sees this one's.
    queryClient.clear();
  };

  const handleAccountDeleted = async () => {
    localStorage.clear();
    // The user no longer exists server-side, so only end the local session.
    await supabase.auth.signOut({ scope: 'local' });
    queryClient.clear();
  };

  useEffect(() => {
    saveToLocalStorage('settings', settings);
  }, [settings]);

  return (
    <motion.div
      animate="animate"
      exit="exit"
      initial="initial"
      transition={pageTransition}
      variants={pageVariants}
    >
      <SectionContainer>
        <Section>
          <Preferences />
        </Section>

        <Section>
          <Divider data-appearance="faint" data-spacing="spacious" />
        </Section>

        <Section>
          <Profile />

          <Divider data-appearance="faint" data-spacing="spacious" />

          <Heading>Password</Heading>

          <Button
            onClick={() => {
              setPasswordSaved(false);
              setPasswordOpen(true);
            }}
          >
            Change password
          </Button>

          {passwordSaved && <Paragraph>Password updated.</Paragraph>}

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
        </Section>

        <Section>
          <Divider data-appearance="faint" data-spacing="spacious" />
        </Section>

        <Section>
          <Heading>Data</Heading>

          <Paragraph>
            Your data is stored on servers in the EU and is never shared with
            anyone. Your data is yours. Download it or delete it at any time.
          </Paragraph>

          <DownloadDataButton />

          <Button
            data-priority="secondary"
            data-tone="danger"
            onClick={() => {
              setDeleteOpen(true);
            }}
          >
            Delete account
          </Button>

          <DeleteAccountModal
            onClose={() => {
              setDeleteOpen(false);
            }}
            onDeleted={() => {
              void handleAccountDeleted();
            }}
            open={deleteOpen}
          />
        </Section>

        <Section>
          <Divider data-appearance="faint" data-spacing="spacious" />
        </Section>

        <Section>
          <Heading>Leaving?</Heading>

          <Button
            onClick={() => {
              void handleSignOut();
            }}
          >
            Sign out
          </Button>
        </Section>
      </SectionContainer>
    </motion.div>
  );
};

export const Route = createFileRoute('/settings')({
  component: Settings,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.query({
        ...habitsQueryOptions(context.userId),
        staleTime: 'static',
      }),
      context.queryClient.query({
        ...eventsQueryOptions(context.userId),
        staleTime: 'static',
      }),
    ]);
  },
});
