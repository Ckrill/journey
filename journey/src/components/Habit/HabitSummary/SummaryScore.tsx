// External
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

// Utilities
import {
  BUMP_SCALE,
  type SummaryPlan,
  tapBump,
} from '../../../helpers/summaryAnimation';
import {
  cancelVibration,
  vibrateConfetti,
  vibrateSummary,
} from '../../../helpers/vibrate';

// Contexts
import { useSettings } from '../../../contexts/settingsContext';

// Miscellaneous
import Confetti from './Confetti';

// Styles
import styles from './SummaryScore.module.scss';

interface Props {
  metCount: number;
  plan: SummaryPlan;
  total: number;
}

interface Spray {
  angle: number;
  id: number;
  /** Sprays from a tap start at once instead of after the intro's count-up. */
  immediate: boolean;
  /** Scales how far the pieces fly. */
  reach: number;
}

/** Rolls a random turn and size so no two sprays look the same. */
const rollSpray = (id: number, immediate: boolean): Spray => ({
  /* eslint-disable sonarjs/pseudo-random -- Only used for decoration. */
  angle: Math.random() * 360,
  id,
  immediate,
  reach: 0.75 + Math.random() * 0.6,
  /* eslint-enable sonarjs/pseudo-random */
});

/**
 * The "met / total" score. It counts up when it appears and, when every goal is
 * met, celebrates with confetti and a vibration that can be replayed by tapping.
 */
const SummaryScore = ({ metCount, plan, total }: Props) => {
  const { vibration } = useSettings();
  const scoreRef = useRef<HTMLSpanElement>(null);
  const nextSprayIdRef = useRef(1);
  const [sprays, setSprays] = useState<Spray[]>(() =>
    plan.celebrate ? [rollSpray(0, false)] : [],
  );

  const vibrateIntro = useEffectEvent(() => {
    if (vibration) vibrateSummary(plan);
  });

  // Plays once on mount, and is cut short if the user navigates away.
  useEffect(() => {
    vibrateIntro();

    return cancelVibration;
  }, []);

  const celebrate = () => {
    const id = nextSprayIdRef.current++;
    setSprays((current) => [...current, rollSpray(id, true)]);

    scoreRef.current?.animate(
      { scale: [1, 1 + BUMP_SCALE] },
      { duration: tapBump.duration * 1000, easing: tapBump.easing },
    );

    if (vibration) vibrateConfetti();
  };

  const label = `${String(metCount)} of ${String(total)}`;
  const score = (
    <span className={styles.score} ref={scoreRef}>
      <span
        aria-hidden
        className={styles.met}
        style={{ '--met': metCount } as CSSProperties}
      />
      <span aria-hidden>&thinsp;/&thinsp;{total}</span>
    </span>
  );

  if (!plan.celebrate) {
    return (
      <span aria-label={label} className={styles.root} role="img">
        {score}
      </span>
    );
  }

  return (
    <button
      aria-label={`${label}. Tap to celebrate`}
      className={styles.root}
      onClick={celebrate}
      type="button"
    >
      {score}

      {sprays.map(({ angle, id, immediate, reach }) => (
        <Confetti
          angle={angle}
          immediate={immediate}
          key={id}
          onDone={() => {
            setSprays((current) => current.filter((spray) => spray.id !== id));
          }}
          reach={reach}
        />
      ))}
    </button>
  );
};

export default SummaryScore;
