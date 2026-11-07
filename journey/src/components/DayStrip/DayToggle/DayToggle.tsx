// External
import clsx from 'clsx';
import { useState } from 'react';
import { BsCheck } from 'react-icons/bs';

// Utilities
import { vibrateError } from '../../../helpers/vibrate';

// Contexts
import { useSettings } from '../../../contexts/settingsContext';

import shared from '../DayStrip.module.scss';
// Styles
import styles from './DayToggle.module.scss';

interface Props {
  date: string;
  done: boolean;
  isFuture: boolean;
  isToday: boolean;
  /** Full weekday name; its first letter is shown on the cell. */
  label: string;
  onToggle: (date: string) => Promise<unknown>;
  planned: boolean;
}

const DayToggle = ({
  date,
  done,
  isFuture,
  isToday,
  label,
  onToggle,
  planned,
}: Props) => {
  const settings = useSettings();
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (settings.vibration && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }

    setPending(true);
    try {
      await onToggle(date);
    } catch {
      setFailed(true);
      if (settings.vibration) vibrateError();
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      aria-current={isToday ? 'date' : undefined}
      aria-label={`${label} ${date}`}
      aria-pressed={done}
      className={clsx(
        shared.day,
        styles.day,
        isToday && styles.today,
        failed && styles.failed,
        planned && styles.planned,
      )}
      data-done={done}
      disabled={isFuture || pending}
      onAnimationEnd={() => {
        setFailed(false);
      }}
      onClick={() => {
        void handleClick();
      }}
      type="button"
    >
      <span className={styles.content}>
        <span className={styles.label}>{label[0]}</span>

        <BsCheck aria-hidden className={styles.check} />
      </span>
    </button>
  );
};

export default DayToggle;
