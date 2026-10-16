// External
import { SignIn as ClerkSignIn } from '@clerk/react';
import { motion } from 'motion/react';

// Miscellaneous
import SectionContainer from '../components/Section/SectionContainer';
import Page from '../components/SignIn/Page';
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
            <ClerkSignIn routing="hash" />
          </SectionContainer>
        </motion.div>
      </Page>
    </motion.div>
  );
};

export default SignIn;
