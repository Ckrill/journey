// External
import { useEffect, useId, useRef } from 'react';

// Contexts
import { useSettings } from '../../contexts/settingsContext';

// Assets
import thump from '../../assets/sounds/thump.mp3';

// Utilities
import { getHeadingSize } from './headingSize';

// Styles
import styles from './Feedback.module.scss';

interface Props {
  completedWeeks: number;
  heading: string;
  setShow: (show: boolean) => void;
  show: boolean;
  subtitle?: string;
}

const Feedback = ({
  completedWeeks,
  heading,
  setShow,
  show,
  subtitle,
}: Props) => {
  const settings = useSettings();

  const headingSize = heading ? getHeadingSize(heading) : 'm';

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();

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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || show === dialog.open) return;

    if (show) dialog.showModal();
    else dialog.close();
  }, [show]);

  return (
    <dialog
      aria-labelledby={headingId}
      className={styles.dialog}
      onClick={() => {
        setShow(false);
      }}
      onClose={() => {
        // Esc and the back gesture close the dialog itself; mirror that into state.
        if (show) setShow(false);
      }}
      ref={dialogRef}
    >
      <audio preload={settings.sound ? 'auto' : 'none'} ref={audioPlayerRef}>
        <source src={thump} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className={styles.container}>
        <h1 className={styles.heading} data-size={headingSize} id={headingId}>
          {heading}
        </h1>

        <p className={styles.paragraph}>
          {subtitle ??
            `${String(completedWeeks)} ${completedWeeks === 1 ? 'week' : 'weeks'} travelled`}
        </p>
      </div>
    </dialog>
  );
};

export default Feedback;
