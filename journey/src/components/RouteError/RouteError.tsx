// External
import { type ErrorComponentProps, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';

// Miscellaneous
import Button from '../Button/Button';
import FieldGroup from '../Form/FieldGroup/FieldGroup';
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
        <Paragraph role="alert">
          Something went wrong.
          <br />
          Check your connection and try again.
        </Paragraph>

        <FieldGroup>
          <Button
            onClick={() => {
              reset();
              void router.invalidate();
            }}
          >
            Try again
          </Button>
        </FieldGroup>
      </Section>
    </div>
  );
};

export default RouteError;
