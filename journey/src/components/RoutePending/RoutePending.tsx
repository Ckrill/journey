// Miscellaneous
import Spinner from '../Spinner/Spinner';

// Styles
import styles from './RoutePending.module.scss';

// The spinner's auto margin centers it on the viewport.
const RoutePending = () => (
  <div className={styles.pending}>
    <Spinner />
  </div>
);

export default RoutePending;
