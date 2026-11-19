// External
import type { CSSProperties } from 'react';

// Styles
import styles from './Confetti.module.scss';

const PIECES = Array.from({ length: 72 }, (_, index) => index);

interface Props {
  /** Turns the whole spray, in degrees, so no two bursts look the same. */
  angle: number;
  /** Starts straight away instead of waiting for the intro's count-up. */
  immediate?: boolean;
  /** Called once every piece has finished flying. */
  onDone: () => void;
  /** Scales how far the pieces fly. */
  reach: number;
}

const Confetti = ({ angle, immediate = false, onDone, reach }: Props) => (
  <span
    aria-hidden
    className={styles.confetti}
    data-immediate={immediate}
    onAnimationEnd={(event) => {
      // Pieces finish at different times, and the event bubbles from each one.
      if (event.currentTarget.getAnimations({ subtree: true }).length === 0) {
        onDone();
      }
    }}
    style={
      {
        '--offset': `${String(angle)}deg`,
        '--reach': reach,
      } as CSSProperties
    }
  >
    {PIECES.map((index) => (
      <i
        className={styles.piece}
        key={index}
        style={{ '--index': index } as CSSProperties}
      />
    ))}
  </span>
);

export default Confetti;
