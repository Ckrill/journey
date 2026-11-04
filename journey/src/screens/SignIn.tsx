// External
import { motion } from 'motion/react';
import { useState } from 'react';

// Miscellaneous
import SectionContainer from '../components/Section/SectionContainer';
import Page from '../components/SignIn/Page';
import SignInForm from '../components/SignIn/SignIn';
import {
  formVariants,
  pageTransition,
  pageVariants,
  titleVariants,
} from '../components/SignIn/transition';
import Spinner from '../components/Spinner/Spinner';

// Styles
import styles from '../components/SignIn/SignIn.module.scss';

interface Props {
  /** Called once the page fully covers the screen, so what's beneath can go. */
  onCovered: () => void;
  /** The stored session is still being read, so only the red page shows. */
  restoringSession: boolean;
}

const SignIn = ({ onCovered, restoringSession }: Props) => {
  // Already opaque on first load, when the page was red before React started.
  const [covered, setCovered] = useState(restoringSession);
  const [formReady, setFormReady] = useState(false);

  return (
    <Page
      animate="animate"
      exit="exit"
      initial={restoringSession ? false : 'initial'}
      onAnimationComplete={(definition) => {
        if (definition !== 'animate') return;
        setCovered(true);
        onCovered();
      }}
      transition={pageTransition}
      variants={pageVariants}
    >
      {restoringSession && <Spinner aria-label="Authenticating" />}

      {covered && !restoringSession && (
        <>
          <div className={styles.title}>
            <motion.div
              animate="animate"
              exit="exit"
              initial="initial"
              variants={titleVariants}
            >
              Journey
            </motion.div>
          </div>

          {/* Mounted from the start so its space is reserved; inert until it has risen into view. */}
          <motion.div
            animate="animate"
            exit="exit"
            inert={!formReady}
            initial="initial"
            onAnimationComplete={(definition) => {
              if (definition === 'animate') setFormReady(true);
            }}
            style={{ display: 'flex', justifyContent: 'center' }}
            variants={formVariants}
          >
            <SectionContainer>
              <SignInForm />
            </SectionContainer>
          </motion.div>
        </>
      )}
    </Page>
  );
};

export default SignIn;
