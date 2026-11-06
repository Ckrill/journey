// External
import type { ReactNode } from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';

// Utilities
import { scrollIntoViewSmoothly } from '../../helpers/scroll';

// Miscellaneous
import Notice from './Notice';

interface Props {
  children: ReactNode;
}

const SuccessMessage = ({ children }: Props) => (
  <Notice
    icon={<BsCheckCircleFill />}
    ref={scrollIntoViewSmoothly}
    role="status"
    tone="success"
  >
    {children}
  </Notice>
);

export default SuccessMessage;
