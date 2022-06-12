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
import { useUser, useUserUpdate } from '../contexts/userContext';

const Settings = () => {
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
