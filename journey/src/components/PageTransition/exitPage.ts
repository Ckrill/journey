// External
import { animate } from 'motion/react';

export const PAGE_DURATION = 0.1;

// The router renders the next route as soon as it commits, so a React exit
// animation never gets to run. Instead, fade the current page out while the
// router is still holding the old route. Use as a child route's `beforeLoad`,
// since the root route is retained and skipped on navigation.
export const exitPage = async ({ preload }: { preload: boolean }) => {
  if (preload) {
    return;
  }

  const page = document.querySelector<HTMLElement>('[data-page-transition]');

  if (page) {
    await animate(
      page,
      { opacity: 0 },
      { duration: PAGE_DURATION, ease: 'easeOut' },
    ).finished;
  }
};
