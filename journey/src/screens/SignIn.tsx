import { motion } from 'framer-motion';

// Settings
import {
  pageTransition,
  pageVariants,
  transition,
  transition2,
  variants,
  variants2,
} from '../components/SignIn/transition';

// Components
import Heading from '../components/Heading/Heading';
import Page from '../components/SignIn/Page';
import Paragraph from '../components/Paragraph/Paragraph';
import SectionContainer from '../components/Section/SectionContainer';
import SignInForm from '../components/SignIn/SignIn';
import Title from '../components/SignIn/Title';

const SignIn = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Page>
        <Title
          initial="initial"
          animate="animate"
          exit={'exit'}
          variants={variants}
          transition={transition}
        >
          Journey
        </Title>

        <motion.div
          style={{ display: 'flex', justifyContent: 'center' }}
          initial="initial"
          animate="animate"
          variants={variants2}
          transition={transition2}
        >
          <SectionContainer>
            <Heading>Welcome friend</Heading>

            <Paragraph>
              What name would you like to be associated with your journey?
            </Paragraph>

            <SignInForm />
          </SectionContainer>
        </motion.div>
      </Page>
    </motion.div>
  );
};

export default SignIn;
