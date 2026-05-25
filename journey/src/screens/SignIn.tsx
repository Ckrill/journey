// External
import { motion } from 'framer-motion';

// Miscellaneous
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import SectionContainer from '../components/Section/SectionContainer';
import Page from '../components/SignIn/Page';
import SignInForm from '../components/SignIn/SignIn';
import Title from '../components/SignIn/Title';
import {
  pageTransition,
  pageVariants,
  transition,
  transition2,
  variants,
  variants2,
} from '../components/SignIn/transition';

const SignIn = () => {
  return (
    <motion.div
      animate="animate"
      exit="exit"
      initial="initial"
      transition={pageTransition}
      variants={pageVariants}
    >
      <Page>
        <Title>
          <motion.div
            animate="animate"
            exit={'exit'}
            initial="initial"
            transition={transition}
            variants={variants}
          >
            Journey
          </motion.div>
        </Title>

        <motion.div
          animate="animate"
          initial="initial"
          style={{ display: 'flex', justifyContent: 'center' }}
          transition={transition2}
          variants={variants2}
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
