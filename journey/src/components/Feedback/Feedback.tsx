import { useEffect, useRef, useState } from 'react';

// Data
import feedbackHeading from '../../data/synonyms/feedback-heading.json';

// Helpers
import { getHeading, getHeadingSize } from '../../helpers/synonyms';

// Sounds
import thump from '../../assets/sounds/thump.mp3';

// Contexts
import { useSettings } from '../../contexts/settingsContext';
import { useStreak } from '../../contexts/streakContext';

// Styles
import styles from './Feedback.module.scss';

type Props = {
  setShow: (show: boolean) => void;
  show: boolean;
};

const Feedback = ({ setShow, show }: Props) => {
  const streak = useStreak();
  const settings = useSettings();

  const [heading, setHeading] = useState('');
  const [headingSize, setHeadingSize] = useState('m');

  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  // Get heading.
  useEffect(() => {
    if (!show || !streak) return;

    const heading = getHeading(feedbackHeading, streak.streak);
    const headingSize = getHeadingSize(heading);

    setHeading(heading);
    setHeadingSize(headingSize);
  }, [show, streak]);

  useEffect(() => {
    if (!show) return;
    const player = audioPlayer.current;
    if (!player) return;

    if (settings.sound) {
      player.currentTime = 0;
      player?.play();
    }

    if (settings.vibration) {
      if ('vibrate' in navigator) {
        // vibration API supported
        setTimeout(() => {
          navigator.vibrate(200);
        }, 100);
      }
    }
  }, [settings.sound, settings.vibration, show]);

  return (
    <div
      className={`${styles.overlay} ${show && styles.show}`}
      onClick={() => setShow(false)}
    >
      <audio preload="auto" ref={audioPlayer}>
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
