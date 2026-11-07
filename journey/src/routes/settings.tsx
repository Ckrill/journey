// External
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

// Utilities
import { saveToLocalStorage, settingsKey } from '../helpers/localStorage';

// Contexts
import { useSettings } from '../contexts/settingsContext';

// Hooks
import { eventsQueryOptions } from '../hooks/useEventsQuery';
import { habitsQueryOptions } from '../hooks/useHabitsQuery';
import { retroReminderQueryOptions } from '../hooks/useRetroReminderQuery';
import { useUserId } from '../hooks/useUserId';

// Miscellaneous
import Divider from '../components/Divider/Divider';
import Heading from '../components/Heading/Heading';
import PageTransition from '../components/PageTransition/PageTransition';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';
import About from '../components/Settings/About';
import Account from '../components/Settings/Account';
import DataPrivacy from '../components/Settings/DataPrivacy';
import Notifications from '../components/Settings/Notifications';
import Preferences from '../components/Settings/Preferences';
import Profile from '../components/Settings/Profile';

const Settings = () => {
  const settings = useSettings();
  const userId = useUserId();

  useEffect(() => {
    saveToLocalStorage(settingsKey(userId), settings);
  }, [settings, userId]);

  return (
    <PageTransition>
      <SectionContainer>
        <Section>
          <Heading level={1} visuallyHidden>
            Settings
          </Heading>

          <Profile />
        </Section>

        <Section>
          <Divider appearance="faint" spacing="spacious" />
        </Section>

        <Section>
          <Preferences />
        </Section>

        <Section>
          <Divider appearance="faint" spacing="spacious" />
        </Section>

        <Section>
          <Notifications />
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
    </PageTransition>
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
      context.queryClient.query(retroReminderQueryOptions(context.userId)),
    ]);
  },
  head: () => ({ meta: [{ title: 'Settings - Journey' }] }),
});
