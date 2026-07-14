import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

type ModalProps = {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({
  title,
  onClose,
  children,
}: ModalProps): React.JSX.Element | null => {
  const modalRoot = document.getElementById('modal');

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div className={styles.modal}>
      <ModalOverlay onClose={onClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${styles.modal__window} p-10`}
      >
        <div className={styles.modal__header}>
          <p className="text text_type_main-large">{title}</p>
          <CloseIcon type="primary" onClick={onClose} />
        </div>
        <div className="mt-3 flex flex-col justify-center items-center">{children}</div>
      </div>
    </div>,
    modalRoot
  );
};
