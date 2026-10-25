import { BsRepeat, BsStopwatch, BsWatch } from 'react-icons/bs';

import type { BarKind } from './helpers/timeBars';

import styles from './TimeProgress.module.scss';

const icons: Record<BarKind, React.ReactNode> = {
  finite: <BsStopwatch aria-hidden />,
  infinite: <BsRepeat aria-hidden />,
  time: <BsWatch aria-hidden />,
};

const unit = (months: number) => (months === 1 ? 'month' : 'months');

interface Props {
  elapsed: number;
  kind: BarKind;
  total: null | number;
}

const BarDetail = ({ elapsed, kind, total }: Props) => {
  const hasTotal = total !== null;

  const text = hasTotal
    ? `${String(elapsed)} / ${String(total)} ${unit(total)}`
    : `${String(elapsed)} ${unit(elapsed)}`;

  return (
    <span className={styles.detail}>
      <span className={styles.text}>{text}</span>

      <span className={styles.icon}>{icons[kind]}</span>
    </span>
  );
};

export default BarDetail;
