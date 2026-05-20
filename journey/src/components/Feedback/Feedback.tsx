import { useEffect, useMemo, useRef } from 'react';

// Data
import feedbackHeading from '../../data/synonyms/feedback-heading.json';

// Helpers
import { getHeading, getHeadingSize } from '../../helpers/synonyms';

// Sounds
import thump from '../../assets/sounds/thump.mp3';

// Contexts
import { useSettings } from '../../contexts/settingsContext';
import { useStreak } from '../../contexts/eventsContext';

// Styles
import styles from './Feedback.module.scss';

type Props = {
  setShow: (show: boolean) => void;
  show: boolean;
};

const Feedback = ({ setShow, show }: Props) => {
  const streak = useStreak();
  const settings = useSettings();

  const heading = useMemo(
    () => (show && streak ? getHeading(feedbackHeading, streak.streak) : ''),
    [show, streak],
  );
  const headingSize = useMemo(
    () => (heading ? getHeadingSize(heading) : 'm'),
    [heading],
  );

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!show) return;
    const player = audioPlayerRef.current;
    if (!player) return;

    if (settings.sound) {
      player.currentTime = 0;
      player?.play();
    }

    if (settings.vibration) {
      if ('vibrate' in navigator) {
        // vibration API supported
        const timeout = setTimeout(() => {
          navigator.vibrate(200);
        }, 100);

        return () => { clearTimeout(timeout); };
      }
    }
  }, [settings.sound, settings.vibration, show]);

  return (
    <div
      className={`${styles.overlay} ${show ? styles.show : ''}`}
      onClick={() => { setShow(false); }}
    >
      <audio preload="auto" ref={audioPlayerRef}>
        <source src={thump} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className={styles.container}>
        {streak.streak > 1 ? (
          <>
            <h1
              className={`${styles.heading} ${
                styles['heading--' + headingSize]
              }`}
            >
              {heading}
            </h1>

            <p className={styles.paragraph}>{streak.streak} days in a row</p>
          </>
        ) : (
          <>
            <h1 className={styles.heading}>Departure</h1>

            <p className={styles.paragraph}>
              Today you embarked on your journey
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Feedback;
