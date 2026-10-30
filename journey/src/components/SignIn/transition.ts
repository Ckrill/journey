import type { Transition } from 'motion/react';

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
  initial: { opacity: 0, x: 1000 },
  animate: { opacity: 1, x: 0 },
};
/* eslint-enable perfectionist/sort-objects */

export const transition: Transition = {
  delay: 0.3,
  duration: 0.5,
  ease: 'easeOut',
};

/* eslint-disable perfectionist/sort-objects */
export const variants2 = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
};
/* eslint-enable perfectionist/sort-objects */

export const transition2: Transition = {
  delay: 0.7,
  duration: 0.3,
  ease: 'easeOut',
};

export const layoutTransition: Transition = {
  delay: 0.5,
  duration: 0.5,
  ease: 'easeInOut',
};
