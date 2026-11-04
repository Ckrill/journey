// External
import { type ErrorComponentProps, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';

// Miscellaneous
import Button from '../Button/Button';
import Paragraph from '../Paragraph/Paragraph';
import Section from '../Section/Section';

// Styles
import styles from './RouteError.module.scss';

const RouteError = ({ error, reset }: ErrorComponentProps) => {
  const router = useRouter();

  // The message stays generic for users; the real error goes to the console.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.error}>
      <Section>
        <Paragraph>
          Something went wrong.
          <br />
          Check your connection and try again.
        </Paragraph>

        <Button
          onClick={() => {
            reset();
            void router.invalidate();
          }}
        >
          Try again
        </Button>
      </Section>
    </div>
  );
};

export default RouteError;
