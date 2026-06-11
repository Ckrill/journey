// External
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

// Settings
import { pageTransition, pageVariants } from '../settings/pageTransition';

// Utilities
import { saveToLocalStorage } from '../helpers/localStorage';

// Contexts
import { useSettings, useSettingsUpdate } from '../contexts/settingsContext';
import { useUser, useUserUpdate } from '../contexts/userContext';

// Hooks
import { useStreakQuery } from '../hooks/useStreakQuery';

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
  const { data: streak } = useStreakQuery();
  const user = useUser();
  const setUser = useUserUpdate();
  const settings = useSettings();
  const setSettings = useSettingsUpdate();

  const clearData = () => {
    // Clear all data
    localStorage.clear();

    setUser(null);

    // Clear a specific item
    // localStorage.removeItem("name of localStorage variable you want to remove");
  };

  // const showData = () => {
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

          {user?.bestStreak ? (
            streak.streak === user.bestStreak ? (
              // Peaking
              <Paragraph>
                You are on fire {user.name}, you pushed your streak to{' '}
                <CountUp countTo={user.bestStreak} /> and counting!
              </Paragraph>
            ) : (
              // Have peaked
              <Paragraph>
                {' '}
                {user.name}, your best streak was{' '}
                <CountUp countTo={user.bestStreak} />.
              </Paragraph>
            )
          ) : (
            // Never started
            <Paragraph>
              Hop on, {user?.name}, and start your journey today!
            </Paragraph>
          )}

          <Button disabled={!user} onClick={clearData}>
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
});
