import { Transition } from 'framer-motion';

export const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const pageTransition: Transition = {
  duration: 0.1,
  delay: 0,
  type: 'tween',
  ease: 'easeOut',
};

export const variants = {
  initial: { transform: 'skewY(-20deg) translateX(1000px)' },
  animate: { transform: 'skewY(-20deg) translateX(0px)' },
};

export const transition: Transition = {
  duration: 0.3,
};

export const variants2 = {
  initial: { opacity: 0, y: '100' },
  animate: { opacity: 1, y: 0 },
};

export const transition2: Transition = {
  delay: 0.25,
  duration: 0.3,
};
