// External
import { motion } from 'motion/react';
import { useState } from 'react';

// Miscellaneous
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
  const [showForm, setShowForm] = useState(false);

  return (
    <motion.div
      animate="animate"
      exit="exit"
      initial="initial"
      transition={pageTransition}
      variants={pageVariants}
    >
      <Page>
        <Title animate={showForm}>
          <motion.div
            animate="animate"
            exit={'exit'}
            initial="initial"
            onAnimationComplete={() => {
              setShowForm(true);
            }}
            transition={transition}
            variants={variants}
          >
            Journey
          </motion.div>
        </Title>

        {showForm && (
          <motion.div
            animate="animate"
            initial="initial"
            style={{ display: 'flex', justifyContent: 'center' }}
            transition={transition2}
            variants={variants2}
          >
            <SectionContainer>
              <SignInForm />
            </SectionContainer>
          </motion.div>
        )}
      </Page>
    </motion.div>
  );
};

export default SignIn;
