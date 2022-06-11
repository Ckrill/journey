import { Transition, Variants } from 'framer-motion';

export const pageVariants: Variants = {
  animate: { opacity: 1, translateY: 0 },
  initial: { opacity: 0, translateY: 15 },
  exit: { opacity: 0 },
};

export const pageTransition: Transition = {
  duration: 0.1,
  delay: 0,
  type: 'tween',
  ease: 'easeOut',
};
