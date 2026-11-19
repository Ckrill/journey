// External
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

// Miscellaneous
import { pageTransition, pageVariants } from './transition';

interface Props {
  children: ReactNode;
}

// Must be a route's root. The exit runs from each route's `beforeLoad`, see `exitPage`.
const PageTransition = ({ children }: Props) => (
  <motion.div
    animate="animate"
    data-page-transition
    initial="initial"
    transition={pageTransition}
    variants={pageVariants}
  >
    {children}
  </motion.div>
);

export default PageTransition;
