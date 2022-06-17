import { useState } from 'react';
import { BsArrowDownCircleFill as ArrowDown } from 'react-icons/bs';
import { useInView } from 'react-intersection-observer';

// Styling
import styles from './ShowMore.module.scss';

type Props = {
  callback: () => void;
};

const ShowMore = ({ callback }: Props) => {
  const [size, setSize] = useState(0);
  const thresholds = () => {
    let result = [];
    const amount = 50;
    let i = 0;
    while (i <= amount) {
      result.push(i / amount);
      i += 1;
    }
    return result;
  };

  const { ref } = useInView({
    onChange: (inView, entry) => {
      if (!inView) return;
      console.clear();
      console.log('IntersectionRatio: ', entry?.intersectionRatio);

      const intersectionRatio = entry?.intersectionRatio || 0;
      setSize(100 * intersectionRatio);

      if (intersectionRatio !== 1) return;

      callback();
      setSize(50);
    },
    rootMargin: '0px',
    threshold: thresholds(),
  });

  return (
    <div className={styles.container}>
      <div className={styles.measurer} ref={ref} />

      <div className={styles.sticky}>
        <ArrowDown
          className={styles.icon}
          color="salmon"
          onClick={callback}
          size={Math.max(size, 50)}
        />

        <div className={styles.shadowIcon} />
      </div>
    </div>
  );
};

export default ShowMore;
