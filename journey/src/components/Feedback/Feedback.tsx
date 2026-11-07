// External
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

// Utilities
import { getHeadingSize } from '../../helpers/synonyms';

// Contexts
import { useSettings } from '../../contexts/settingsContext';

// Assets
import thump from '../../assets/sounds/thump.mp3';

// Styles
import styles from './Feedback.module.scss';

interface Props {
  heading: string;
  setShow: (show: boolean) => void;
  show: boolean;
  streak: number;
}

const Feedback = ({ heading, setShow, show, streak }: Props) => {
  const settings = useSettings();

  const headingSize = heading ? getHeadingSize(heading) : 'm';

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!show) return;
    const player = audioPlayerRef.current;
    if (!player) return;

    if (settings.sound) {
      player.currentTime = 0;
      void player.play();
    }

    if (settings.vibration) {
      if ('vibrate' in navigator) {
        // vibration API supported
        const timeout = setTimeout(() => {
          navigator.vibrate(200);
        }, 200);

        return () => {
          clearTimeout(timeout);
        };
      }
    }
  }, [settings.sound, settings.vibration, show]);

  return (
    <div
      className={clsx(styles.overlay, show && styles.show)}
      onClick={() => {
        setShow(false);
      }}
    >
      <audio preload="auto" ref={audioPlayerRef}>
        <source src={thump} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className={styles.container}>
        {streak > 1 ? (
          <>
            <h1 className={styles.heading} data-size={headingSize}>
              {heading}
            </h1>

            <p className={styles.paragraph}>{streak} weeks in a row</p>
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
