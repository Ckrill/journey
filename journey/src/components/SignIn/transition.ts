// External
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

// The title and form share the distance and transition, so they rise in lockstep.
const slideDistance = '10dvh';

const slideUpTransition: Transition = {
  delay: 1.1,
  duration: 0.5,
  ease: 'easeInOut',
};

const slideInTransition: Transition = {
  delay: 0.3,
  duration: 0.3,
  ease: 'easeOut',
};

/* eslint-disable perfectionist/sort-objects */
export const titleVariants: Variants = {
  initial: { opacity: 0, x: '100vw', y: slideDistance },
  animate: {
    opacity: 1,
    x: '0vw',
    y: '0dvh',
    transition: {
      opacity: slideInTransition,
      x: slideInTransition,
      y: slideUpTransition,
    },
  },
  exit: { opacity: 0, y: `-${slideDistance}`, transition: exitTransition },
};

export const formVariants: Variants = {
  initial: { opacity: 0, y: slideDistance },
  animate: { opacity: 1, y: '0dvh', transition: slideUpTransition },
  exit: { opacity: 0, y: slideDistance, transition: exitTransition },
};
/* eslint-enable perfectionist/sort-objects */
