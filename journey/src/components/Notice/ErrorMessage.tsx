// External
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { BsExclamationOctagonFill } from 'react-icons/bs';

// Utilities
import { scrollIntoViewSmoothly } from '../../helpers/scroll';

// Contexts
import { useSettings } from '../../contexts/settingsContext';

// Miscellaneous
import Notice from './Notice';

// Two short buzzes then a long one reads as "no".
const ERROR_VIBRATION = [60, 50, 60, 50, 200];

interface Props {
  children: ReactNode;
}

const ErrorMessage = ({ children }: Props) => {
  const { vibration } = useSettings();

  useEffect(() => {
    if (vibration && 'vibrate' in navigator) {
      navigator.vibrate(ERROR_VIBRATION);
    }
  }, [vibration]);

  return (
    <Notice
      icon={<BsExclamationOctagonFill />}
      ref={scrollIntoViewSmoothly}
      role="alert"
      tone="error"
    >
      {children}
    </Notice>
  );
};

export default ErrorMessage;
