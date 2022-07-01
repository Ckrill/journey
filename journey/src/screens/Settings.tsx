import { motion } from 'framer-motion';

// Settings
import { pageTransition, pageVariants } from '../settings/pageTransition';

// Components
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Button from '../components/Button/Button';
import Divider from '../components/Divider/Divider';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';

// Contexts
import { useStreak } from '../contexts/streakContext';
import { useUser, useUserUpdate } from '../contexts/userContext';
import { useSettings, useSettingsUpdate } from '../contexts/settingsContext';
import { saveToLocalStorage } from '../helpers/localStorage';
import { useEffect } from 'react';
import Checkbox from '../components/Form/Checkbox';
import CheckboxGroup from '../components/Form/CheckboxGroup';

const Settings = () => {
  const streak = useStreak();
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

  useEffect(() => {
    saveToLocalStorage('settings', settings);
  }, [settings]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <SectionContainer>
        <Section>
          <Heading>Profile</Heading>

          <Paragraph>
            Yo {user?.name},
            {streak.streak === user?.bestStreak
              ? ` your best streak is ${user?.bestStreak} and counting!`
              : ` your best streak was ${user?.bestStreak}.`}
          </Paragraph>

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
              callback={() => handleSettingsToggle('sound')}
              checked={settings.sound}
              id="sound"
              label="Sound"
            />

            <Checkbox
              callback={() => handleSettingsToggle('vibration')}
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

export default Settings;
