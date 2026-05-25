import type { Transition, Variants } from 'framer-motion';

/* eslint-disable perfectionist/sort-objects */
export const pageVariants: Variants = {
  initial: { opacity: 0, translateY: 15 },
  animate: { opacity: 1, translateY: 0 },
  exit: { opacity: 0 },
};
/* eslint-enable perfectionist/sort-objects */

export const pageTransition: Transition = {
  delay: 0,
  duration: 0.1,
  ease: 'easeOut',
  type: 'tween',
};
