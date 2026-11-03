// External
import { motion, type Transition, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

/* eslint-disable perfectionist/sort-objects */
const variants: Variants = {
  initial: { opacity: 0, translateY: 15 },
  animate: { opacity: 1, translateY: 0 },
  exit: { opacity: 0 },
};
/* eslint-enable perfectionist/sort-objects */

const transition: Transition = {
  delay: 0,
  duration: 0.1,
  ease: 'easeOut',
  type: 'tween',
};

interface Props {
  children: ReactNode;
}

// Must be a route's root so the router's AnimatePresence can run the exit.
const PageTransition = ({ children }: Props) => (
  <motion.div
    animate="animate"
    exit="exit"
    initial="initial"
    transition={transition}
    variants={variants}
  >
    {children}
  </motion.div>
);

export default PageTransition;
