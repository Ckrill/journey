// External
import { motion, type Transition, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

// Miscellaneous
import { PAGE_DURATION } from './exitPage';

/* eslint-disable perfectionist/sort-objects */
const variants: Variants = {
  initial: { opacity: 0, translateY: 15 },
  animate: { opacity: 1, translateY: 0 },
};
/* eslint-enable perfectionist/sort-objects */

const transition: Transition = {
  delay: 0,
  duration: PAGE_DURATION,
  ease: 'easeOut',
  type: 'tween',
};

interface Props {
  children: ReactNode;
}

// Must be a route's root. The exit is run by `exitPage` from the root route.
const PageTransition = ({ children }: Props) => (
  <motion.div
    animate="animate"
    data-page-transition
    initial="initial"
    transition={transition}
    variants={variants}
  >
    {children}
  </motion.div>
);

export default PageTransition;
