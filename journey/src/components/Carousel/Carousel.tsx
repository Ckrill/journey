// External
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';

// Direction-aware slide: 1 = forward (new slide enters from the right),
// -1 = backward (enters from the left).
const slideVariants = {
  center: { opacity: 1, x: 0 },
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 100 : -100 }),
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -100 : 100 }),
};

// Swipe detection: factor in both distance and velocity so a short, fast flick
// counts the same as a long, slow drag.
const swipeConfidenceThreshold = 10_000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

type Props = {
  children: ReactNode;
  direction: number;
  onNext?: () => void;
  onPrev?: () => void;
  slideKey: string;
};

const Carousel = ({ children, direction, onNext, onPrev, slideKey }: Props) => (
  <AnimatePresence custom={direction} initial={false} mode="wait">
    <motion.div
      animate="center"
      custom={direction}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.25}
      exit="exit"
      initial="enter"
      key={slideKey}
      onDragEnd={(_event, info) => {
        const power = swipePower(info.offset.x, info.velocity.x);
        if (power < -swipeConfidenceThreshold) {
          onNext?.();
        } else if (power > swipeConfidenceThreshold) {
          onPrev?.();
        }
      }}
      style={{ touchAction: 'pan-y', width: '100%' }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      variants={slideVariants}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

export default Carousel;
