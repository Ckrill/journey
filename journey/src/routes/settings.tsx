// External
import { useClerk, useUser } from '@clerk/react';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { useEffect } from 'react';

// Settings
import { pageTransition, pageVariants } from '../settings/pageTransition';

// Utilities
import { saveToLocalStorage } from '../helpers/localStorage';
import { calculateStreak, overallBestStreak } from '../helpers/streak';

// Contexts
import { useSettings, useSettingsUpdate } from '../contexts/settingsContext';

// Hooks
import { eventsQueryOptions, useEventsQuery } from '../hooks/useEventsQuery';
import { habitsQueryOptions, useHabitsQuery } from '../hooks/useHabitsQuery';

// Miscellaneous
import Button from '../components/Button/Button';
import CountUp from '../components/CountUp/CountUp';
import Divider from '../components/Divider/Divider';
import Checkbox from '../components/Form/Checkbox/Checkbox';
import CheckboxGroup from '../components/Form/Checkbox/CheckboxGroup';
import Input from '../components/Form/Input/Input';
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';

const currentYear = new Date().getFullYear();

const Settings = () => {
  const { data: habits } = useHabitsQuery();
  const { data: events } = useEventsQuery();
  const { user } = useUser();
  const { signOut } = useClerk();
  const queryClient = useQueryClient();
  const settings = useSettings();
  const setSettings = useSettingsUpdate();
  const name = user?.firstName ?? user?.username ?? 'friend';

  const bestStreak = overallBestStreak(habits, events);
  const currentBest = habits.reduce(
    (max, habit) => Math.max(max, calculateStreak(habit, events).current),
    0,
  );

  const birthError =
    settings.birthYear !== undefined &&
    (settings.birthYear < 1900 || settings.birthYear > currentYear);

  let profileMessage: React.ReactNode;
  if (!bestStreak) {
    profileMessage = (
      <Paragraph>Hop on, {name}, and start your journey today!</Paragraph>
    );
  } else if (currentBest === bestStreak) {
    profileMessage = (
      <Paragraph>
        You are on fire, {name}.<br />
        You pushed your streak to <CountUp countTo={bestStreak} />!
      </Paragraph>
    );
  } else {
    profileMessage = (
      <Paragraph>
        {' '}
        {name}, your best streak was <CountUp countTo={bestStreak} /> weeks.
      </Paragraph>
    );
  }

  const handleSignOut = async () => {
    localStorage.clear();
    await signOut();
    // Drop cached data so the next account never sees this one's.
    queryClient.clear();
  };

  // const showData = () => {
  // eslint-disable-next-line sonarjs/todo-tag
  //   // TODO: Show data
  //   console.log('Show data');
  // };

  const handleSettingsToggle = (setting: 'sound' | 'vibration') => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const handleBirthYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    setSettings({ ...settings, birthYear: value || undefined });
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
          <Heading>Profile</Heading>

          {profileMessage}

          <Button
            disabled={!user}
            onClick={() => {
              void handleSignOut();
            }}
          >
            Sign out
          </Button>
        </Section>

        <Section>
          <Divider data-appearance="faint" data-spacing="spacious" />
        </Section>

        <Section>
          <Heading>Sound / vibration</Heading>

          <CheckboxGroup>
            <Checkbox
              callback={() => {
                handleSettingsToggle('sound');
              }}
              checked={settings.sound}
              id="sound"
              label="Sound"
            />

            <Checkbox
              callback={() => {
                handleSettingsToggle('vibration');
              }}
              checked={settings.vibration}
              id="vibration"
              label="Vibration"
            />
          </CheckboxGroup>
        </Section>

        <Section>
          <Divider data-appearance="faint" data-spacing="spacious" />
        </Section>

        <Section>
          <Heading>Birth year</Heading>

          <Input
            assistiveText="Used for your clock."
            errorText={birthError ? 'Please enter a valid year.' : undefined}
            id="birthYear"
            labelText="Year of birth"
            max={currentYear}
            min={1900}
            onChange={handleBirthYearChange}
            type="number"
            value={settings.birthYear}
          />
        </Section>

        <Section>
          <Divider data-appearance="faint" data-spacing="spacious" />
        </Section>

        <Section>
          <Heading>Data</Heading>

          <Paragraph>
            The data you save in this app, is saved on a server. It is not
            shared with anyone and is only visible to you.
          </Paragraph>

          {/* <Button onClick={showData}>See my data</Button>

          <Button onClick={clearData} data-priority="secondary">
            Clear data
          </Button> */}
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
