// External
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { type ReactNode, useState } from 'react';

// Direction-aware push: 1 = forward (new slide enters from the right),
// -1 = backward (enters from the left). Old and new slide move together.
const slideVariants: Variants = {
  center: { x: 0 },
  enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%' }),
  exit: (direction: number) => ({ x: direction > 0 ? '-100%' : '100%' }),
};

const slideTransition = {
  damping: 40,
  stiffness: 400,
  type: 'spring',
} as const;

// A swipe counts if it travels far enough (px) or is a fast flick (px/s).
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 500;

const slideStyle = { width: '100%' };
// popLayout positions the exiting slide against this; clip hides the off-screen one.
const viewportStyle = {
  overflowX: 'clip',
  position: 'relative',
  width: '100%',
} as const;

interface Props {
  children: ReactNode;
  onNext: () => void;
  onPrev: () => void;
  // Must sort in slide order; direction is derived from comparing keys.
  slideKey: string;
}

const Carousel = ({ children, onNext, onPrev, slideKey }: Props) => {
  const [prevKey, setPrevKey] = useState(slideKey);
  const [direction, setDirection] = useState(1);

  if (prevKey !== slideKey) {
    setPrevKey(slideKey);
    setDirection(slideKey > prevKey ? 1 : -1);
  }

  return (
    <div style={viewportStyle}>
      <AnimatePresence custom={direction} initial={false} mode="popLayout">
        <motion.div
          animate="center"
          custom={direction}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          exit="exit"
          initial="enter"
          key={slideKey}
          onDragEnd={(_event, { offset, velocity }) => {
            const farEnough = Math.abs(offset.x) > SWIPE_DISTANCE;
            const fastEnough = Math.abs(velocity.x) > SWIPE_VELOCITY;
            if (!farEnough && !fastEnough) return;

            const delta = farEnough ? offset.x : velocity.x;
            (delta < 0 ? onNext : onPrev)();
          }}
          style={slideStyle}
          transition={slideTransition}
          variants={slideVariants}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Carousel;
