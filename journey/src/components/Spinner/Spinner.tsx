import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Styles
import styles from './Spinner.module.scss';

const Spinner = ({ loadingMessage }: { loadingMessage: string }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show the spinner only after some time.
    const timer = setTimeout(() => setShow(true), 1000);

    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <div className={`${styles.spinner} ${show ? styles['spinner--show'] : ''}`}>
      Loading: {loadingMessage}
    </div>
  );
};

Spinner.propTypes = { loadingMessage: PropTypes.string.isRequired };

export default Spinner;
