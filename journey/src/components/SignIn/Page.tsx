import React from 'react';

// Styling
import styles from './SignIn.module.scss';

type Props = {
  children: React.ReactNode;
};

const SectionPage = (props: Props) => (
  <div className={styles.page}>{props.children}</div>
);

export default SectionPage;
