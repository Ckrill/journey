import React from 'react';

// Styling
import styles from './SlideIn.module.css';

// Images
// import close from "../../../images/icons/close--white.svg";

type Props = {
  children: React.ReactNode;
  isShown?: Boolean;
  toggleHandler?: any;
};

const SlideIn = (props: Props) => (
  <div className={styles.slideIn} data-visible={props.isShown}>
    <div className={styles.box}>
      {/* TODO: Close could be moved to it's own module? */}
      <div className={styles.close} onClick={props.toggleHandler}>
        {/* <img className={styles.closeIcon} src={close} alt="Close" /> */}
        close
      </div>
      {props.children}
    </div>
    <div className={styles.placeholder}>
      {/* Placeholder component to force height for slideIn */}
      {props.children}
    </div>
  </div>
);

export default SlideIn;
