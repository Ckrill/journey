// External
import React from 'react';

// Styles
import styles from './SignIn.module.scss';

interface Props {
  children: React.ReactNode;
}

const Title = (props: Props) => {
  return <div className={styles.title}>{props.children}</div>;
};

export default Title;
