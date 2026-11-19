// External
import { animate, type Transition, type Variants } from 'motion/react';

export const pageTransition: Transition = {
  delay: 0,
  duration: 0.1,
  ease: 'easeOut',
  type: 'tween',
};

const exit = { opacity: 0 };

/* eslint-disable perfectionist/sort-objects */
export const pageVariants: Variants = {
  initial: { opacity: 0, translateY: 15 },
  animate: { opacity: 1, translateY: 0 },
  exit,
};
/* eslint-enable perfectionist/sort-objects */

// The router swaps routes as soon as it commits, so `AnimatePresence` never
// gets to run an exit. Fade the page out in the router's `beforeLoad` instead,
// while the old route is still on screen. It must be set on each page route,
// since the root route is retained and skipped on navigation.
export const exitPage = async ({
  cause,
}: {
  cause: 'enter' | 'preload' | 'stay';
}) => {
  const page = document.querySelector<HTMLElement>('[data-page-transition]');

  // A route that is already open doesn't remount, so it would stay faded out.
  if (cause !== 'enter' || !page) {
    return;
  }

  await animate(page, exit, pageTransition).finished;
};
