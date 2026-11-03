import type { Transition, Variants } from 'motion/react';

export const pageTransition: Transition = {
  delay: 0,
  duration: 0.5,
  ease: 'easeInOut',
  type: 'tween',
};

// The content leaves first; the red only fades once the children are gone.
/* eslint-disable perfectionist/sort-objects */
export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { ...pageTransition, delay: 0.5, when: 'afterChildren' },
  },
};
/* eslint-enable perfectionist/sort-objects */

const exitTransition: Transition = {
  delay: 0,
  duration: 0.3,
  ease: 'easeIn',
};

/* eslint-disable perfectionist/sort-objects */
export const variants: Variants = {
  initial: { opacity: 0, x: 1000 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, transition: exitTransition, y: -100 },
};
/* eslint-enable perfectionist/sort-objects */

export const transition: Transition = {
  delay: 0.3,
  duration: 0.5,
  ease: 'easeOut',
};

/* eslint-disable perfectionist/sort-objects */
export const variants2: Variants = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100, transition: exitTransition },
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
