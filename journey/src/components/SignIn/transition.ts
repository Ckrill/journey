import type { Transition } from 'framer-motion';

/* eslint-disable perfectionist/sort-objects */
export const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};
/* eslint-enable perfectionist/sort-objects */

export const pageTransition: Transition = {
  delay: 0,
  duration: 0.1,
  ease: 'easeOut',
  type: 'tween',
};

/* eslint-disable perfectionist/sort-objects */
export const variants = {
  initial: { transform: 'translateX(1000px)' },
  animate: { transform: 'translateX(0px)' },
};
/* eslint-enable perfectionist/sort-objects */

export const transition: Transition = {
  duration: 0.3,
  ease: 'easeOut',
};

/* eslint-disable perfectionist/sort-objects */
export const variants2 = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
};
/* eslint-enable perfectionist/sort-objects */

export const transition2: Transition = {
  delay: 0.25,
  duration: 0.3,
  ease: 'easeOut',
};
