// External
import { type ReactNode, useEffect, useLayoutEffect, useRef } from 'react';

// Styles
import styles from './Carousel.module.scss';

type SnapEvent = Event & { snapTargetInline: Element | null };

interface Props {
  // Pending slide while swiping, or null once the swipe returns to the current slide.
  onPreview: (key: null | string) => void;
  // A swipe settled on another slide.
  onSettle: (key: string) => void;
  slideKey: string;
  // Ordered slides including the current one, so a fast swipe has room before the edge.
  slides: { key: string; node: ReactNode }[];
}

const Carousel = ({ onPreview, onSettle, slideKey, slides }: Props) => {
  const pagerRef = useRef<HTMLDivElement>(null);

  // Keep the current slide in view; this also recenters after a swipe shifts the window.
  useLayoutEffect(() => {
    const pager = pagerRef.current;
    if (!pager) return;

    const index = Array.from(pager.children).findIndex(
      (child) => (child as HTMLElement).dataset.key === slideKey,
    );
    pager.scrollTo({ behavior: 'instant', left: index * pager.clientWidth });
  }, [slideKey]);

  // Fires as soon as the browser predicts the snap target, before the swipe settles.
  useEffect(() => {
    const pager = pagerRef.current;
    if (!pager) return;

    const handleSnapChanging = (event: Event) => {
      const target = (event as SnapEvent).snapTargetInline;
      const key =
        target instanceof HTMLElement ? target.dataset.key : undefined;
      if (key) onPreview(key);
    };

    pager.addEventListener('scrollsnapchanging', handleSnapChanging);
    return () => {
      pager.removeEventListener('scrollsnapchanging', handleSnapChanging);
    };
  }, [onPreview]);

  const handleScrollEnd = () => {
    const pager = pagerRef.current;
    if (!pager) return;

    const index = Math.round(pager.scrollLeft / pager.clientWidth);
    const key = (pager.children[index] as HTMLElement | undefined)?.dataset.key;
    if (!key) return;

    if (key === slideKey) onPreview(null);
    else onSettle(key);
  };

  return (
    <div className={styles.pager} onScrollEnd={handleScrollEnd} ref={pagerRef}>
      {slides.map(({ key, node }) => {
        const isCurrent = key === slideKey;
        return (
          <div
            aria-hidden={!isCurrent}
            className={styles.slide}
            data-key={key}
            inert={!isCurrent}
            key={key}
          >
            {node}
          </div>
        );
      })}
    </div>
  );
};

export default Carousel;
