import styles from './modal-overlay.module.css';

export const ModalOverlay = ({
  onClose,
}: {
  onClose: () => void;
}): React.JSX.Element => {
  return <div className={styles.modal_overlay} onClick={onClose} />;
};
