import { motion } from 'framer-motion';

// Settings
import { pageTransition, pageVariants } from '../settings/pageTransition';
import { settings } from '../settings/settings';

// Helpers
import { saveToLocalStorage } from '../helpers/localStorage';

// Data
import user2 from '../data/dummy/user.json';
import exercises from '../data/dummy/exercises.json';
import tests from '../data/dummy/tests.json';
import workouts from '../data/dummy/workouts.json';
import milestones from '../data/dummy/milestones.json';

// Components
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import Button from '../components/Button/Button';
import Divider from '../components/Divider/Divider';
import Section from '../components/Section/Section';
import SectionContainer from '../components/Section/SectionContainer';

// Contexts
import { useUser, useUserUpdate } from '../contexts/userContext';

const Settings = () => {
  const user = useUser();
  const setUser = useUserUpdate();

  const addDummyData = () => {
    saveToLocalStorage('user', user2);
    saveToLocalStorage('exercises', exercises);
    saveToLocalStorage('tests', tests);
    saveToLocalStorage('workouts', workouts);
    saveToLocalStorage('milestones', milestones);
  };

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
          <Heading>Settings</Heading>

          {user ? (
            <>
              <Paragraph>Name:{!user ? ' friend' : ` ${user.name}`}</Paragraph>

              <Button disabled={!user} onClick={clearData}>
                Sign out
              </Button>
            </>
          ) : (
            <Paragraph>Sign in to see your settings.</Paragraph>
          )}
        </Section>

        {/* <Section>
          <Divider data-appearance="faint" data-spacing="spacious" />
        </Section>

        <Section>
          <Heading>Data</Heading>
          
          <Paragraph>
            The data you put into this app, never leaves your device. It is
            saved in your local storage, and no one is able to see it but you.
          </Paragraph>

          <Button onClick={showData}>See my data</Button>

          <Button onClick={clearData} data-priority="secondary">
            Clear data
          </Button>
        </Section> */}

        {!settings.production && (
          <>
            <Section>
              <Divider data-appearance="faint" data-spacing="spacious" />
            </Section>

            <Section>
              <Heading>Testing</Heading>

              <Paragraph>
                For testing purposes you can add dummy data here.
              </Paragraph>

              <Button onClick={addDummyData}>Add dummy data</Button>
            </Section>
          </>
        )}
      </SectionContainer>
    </motion.div>
  );
};

export default Settings;
