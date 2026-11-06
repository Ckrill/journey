// External
import React from 'react';
import { BsExclamationOctagonFill } from 'react-icons/bs';

// Miscellaneous
import Notice from './Notice';

interface Props {
  children: React.ReactNode;
}

const ErrorMessage = ({ children }: Props) => (
  <Notice icon={<BsExclamationOctagonFill />} role="alert" tone="error">
    {children}
  </Notice>
);

export default ErrorMessage;
