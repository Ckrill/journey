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
import CountUp from '../components/CountUp/CountUp';

const Settings = () => {
  const streak = useStreak();
  const user = useUser();
  const setUser = useUserUpdate();

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
          <Heading>Profile</Heading>

          {user?.bestStreak ? (
            streak.streak === user?.bestStreak ? (
              // Peaking
              <Paragraph>
                You are on fire {user?.name}, your best streak is{' '}
                <CountUp countTo={user?.bestStreak} /> and counting!
              </Paragraph>
            ) : (
              // Have peaked
              <Paragraph>
                {' '}
                Yo {user?.name}, your best streak was{' '}
                <CountUp countTo={user?.bestStreak} />.
              </Paragraph>
            )
          ) : (
            // Never started
            <Paragraph>
              Hop on, {user?.name}, and start you journey today!
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
