// External
import type React from 'react';

// Styles
import styles from './ParagraphGroup.module.scss';

interface Props {
  /** `Paragraph` elements. */
  children: React.ReactNode;
  /** `Paragraph` elements revealed when the user taps the toggle. */
  more?: React.ReactNode;
}

const ParagraphGroup = ({ children, more }: Props) => (
  <div className={styles.group}>
    {children}

    {Boolean(more) && (
      <details className={styles.more}>
        <summary className={styles.toggle}>
          <span className={styles.showMore}>Show more</span>
          <span className={styles.showLess}>Show less</span>
        </summary>

        {more}
      </details>
    )}
  </div>
);

export default ParagraphGroup;
