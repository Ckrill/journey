// External
import { useEffect, useRef } from 'react';
// Types
import type { ReactNode } from 'react';

// Styles
import styles from './Modal.module.scss';

interface Props {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
}

const Modal = ({ children, onClose, open }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Drive the native dialog from the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // The dialog closes itself on Esc / backdrop / platform controls; mirror that
  // back into React state, but ignore the `close` from our programmatic close.
  const handleClose = () => {
    if (open) onClose();
  };

  return (
    <dialog
      className={styles.dialog}
      closedby="any"
      onClose={handleClose}
      ref={dialogRef}
    >
      {children}
    </dialog>
  );
};

export default Modal;
