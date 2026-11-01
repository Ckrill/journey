// External
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { useEffect } from 'react';

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
import Divider from '../components/Divider/Divider';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import About from '../components/Settings/About';
import Account from '../components/Settings/Account';
import DataPrivacy from '../components/Settings/DataPrivacy';
import Preferences from '../components/Settings/Preferences';
import Profile from '../components/Settings/Profile';

const Settings = () => {
  const settings = useSettings();

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
          <Divider appearance="faint" spacing="spacious" />
        </Section>

        <Section>
          <Profile />
        </Section>

        <Section>
          <Divider appearance="faint" spacing="spacious" />
        </Section>

        <Section>
          <Account />
        </Section>

        <Section>
          <Divider appearance="faint" spacing="spacious" />
        </Section>

        <Section>
          <DataPrivacy />
        </Section>

        <Section>
          <Divider appearance="faint" spacing="spacious" />
        </Section>

        <Section>
          <About />
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
