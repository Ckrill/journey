import type { Variants } from 'motion/react';

/* eslint-disable perfectionist/sort-objects */
export const variants: Variants = {
  initial: { opacity: 0, translateY: 15 },
  animate: { opacity: 1, translateY: 0 },
  exit: { height: 0 },
};
/* eslint-enable perfectionist/sort-objects */
