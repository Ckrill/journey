// External
import { useEffect, useRef } from 'react';
// Types
import type { MouseEvent, ReactNode, UIEvent } from 'react';

// Styles
import styles from './Modal.module.scss';

interface Props {
  children: ReactNode;
  /** When false, Esc, backdrop taps and sheet swipes cannot close the modal. */
  dismissible?: boolean;
  /** The `id` of the heading inside that names the dialog. */
  labelledBy: string;
  onClose: () => void;
  open: boolean;
}

// Mirrors the bottom-sheet breakpoint in Modal.module.scss.
const isSheet = () => window.matchMedia('(width < 600px)').matches;

// The top is the sheet's "closed" position. Snapping can rest at a fractional
// offset (seen on Firefox), so don't compare to 0.
const isScrolledToTop = (scroller: HTMLElement) => scroller.scrollTop < 1;

// A sheet taller than the viewport stops at its top edge, not its bottom.
const openScrollTop = (scroller: HTMLElement) =>
  Math.min(
    scroller.scrollHeight - scroller.clientHeight,
    scroller.clientHeight,
  );

const Modal = ({
  children,
  dismissible = true,
  labelledBy,
  onClose,
  open,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Drive the native dialog from the `open` prop. On the sheet, opening scrolls
  // it into view and closing scrolls it away; `scrollend` at the top then closes.
  useEffect(() => {
    const dialog = dialogRef.current;
    const scroller = scrollerRef.current;
    if (!dialog || !scroller || open === dialog.open) return;

    if (open) {
      dialog.showModal();
      if (isSheet()) {
        scroller.scrollTo({ behavior: 'auto', top: openScrollTop(scroller) });
      }
    } else if (isSheet() && !isScrolledToTop(scroller)) {
      scroller.scrollTo({ behavior: 'auto', top: 0 });
    } else {
      // No scroll will happen, so `scrollend` can't close it for us.
      dialog.close();
    }
  }, [open]);

  // Resting at the top snap stop means the sheet was swiped (or scrolled) away.
  const handleScrollEnd = (event: UIEvent<HTMLDivElement>) => {
    const scroller = event.currentTarget;
    if (!isScrolledToTop(scroller)) return;

    if (dismissible) {
      dialogRef.current?.close();
    } else {
      scroller.scrollTo({ behavior: 'auto', top: openScrollTop(scroller) });
    }
  };

  // The dialog closes itself on Esc / backdrop / platform controls; mirror that
  // back into React state, but ignore the `close` from our programmatic close.
  const handleClose = () => {
    if (open) onClose();
  };

  // The sheet covers no backdrop of its own, so a tap above it dismisses it.
  const handleScrollerClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !isSheet() || !dismissible) {
      return;
    }
    event.currentTarget.scrollTo({ behavior: 'auto', top: 0 });
  };

  return (
    <dialog
      aria-labelledby={labelledBy}
      className={styles.dialog}
      closedby={dismissible ? 'any' : 'none'}
      onCancel={(event) => {
        if (!dismissible) {
          event.preventDefault();
          return;
        }
        // Back-swipe/Esc would close instantly; animate the sheet away instead.
        const scroller = scrollerRef.current;
        if (isSheet() && scroller && !isScrolledToTop(scroller)) {
          event.preventDefault();
          scroller.scrollTo({ behavior: 'auto', top: 0 });
        }
      }}
      onClose={handleClose}
      ref={dialogRef}
    >
      <div
        className={styles.scroller}
        onClick={handleScrollerClick}
        onScrollEnd={handleScrollEnd}
        ref={scrollerRef}
      >
        <div className={styles.sheet}>{children}</div>
      </div>
    </dialog>
  );
};

export default Modal;
