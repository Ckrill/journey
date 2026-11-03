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

interface Props {
  /** Called once the page fully covers the screen, so what's beneath can go. */
  onCovered: () => void;
}

const SignIn = ({ onCovered }: Props) => {
  const [covered, setCovered] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <Page
      animate="animate"
      exit="exit"
      initial="initial"
      onAnimationComplete={(definition) => {
        if (definition !== 'animate') return;
        setCovered(true);
        onCovered();
      }}
      transition={pageTransition}
      variants={pageVariants}
    >
      {covered && (
        <Title animate={showForm}>
          <motion.div
            animate="animate"
            exit="exit"
            initial="initial"
            onAnimationComplete={(definition) => {
              if (definition === 'animate') setShowForm(true);
            }}
            transition={transition}
            variants={variants}
          >
            Journey
          </motion.div>
        </Title>
      )}

      {showForm && (
        <motion.div
          animate="animate"
          exit="exit"
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
  );
};

export default SignIn;
