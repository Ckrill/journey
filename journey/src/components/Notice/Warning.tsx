// External
import React from 'react';
import { BsExclamationTriangleFill } from 'react-icons/bs';

// Miscellaneous
import Notice from './Notice';

interface Props {
  children: React.ReactNode;
}

const Warning = ({ children }: Props) => (
  <Notice icon={<BsExclamationTriangleFill />} tone="warning">
    {children}
  </Notice>
);

export default Warning;
