// External
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { BsExclamationOctagonFill } from 'react-icons/bs';

// Utilities
import { scrollIntoViewSmoothly } from '../../helpers/scroll';
import { vibrateError } from '../../helpers/vibrate';

// Contexts
import { useSettings } from '../../contexts/settingsContext';

// Miscellaneous
import Notice from './Notice';

interface Props {
  children: ReactNode;
}

const ErrorMessage = ({ children }: Props) => {
  const { vibration } = useSettings();

  useEffect(() => {
    if (vibration) vibrateError();
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
