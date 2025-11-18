import React, { FormEvent } from 'react';
import ReactModal from 'react-modal';

import styles from './styles.module.scss';

type QuestionModalProps = {
  title: string;
  body: string;
  open: boolean;
  btnLeft: string;
  btnRight: string;
  submit?: boolean;
  handleCancelModal: () => void;
  handleClosedComponent?: () => void;
  handleSubmit?: (event: FormEvent) => Promise<void>;
};

export function QuestionModal({
  open,
  handleCancelModal,
  handleSubmit,
  handleClosedComponent,
  body,
  title,
  btnLeft,
  btnRight,
  submit,
}: QuestionModalProps) {
  const handleOnClick = async (event: FormEvent) => {
    handleSubmit && (await handleSubmit(event));
    handleCancelModal();
  };

  return (
    <ReactModal
      isOpen={open}
      onRequestClose={handleCancelModal}
      className={styles.modal}
      overlayClassName={styles.overlay}
      ariaHideApp={false}
    >
      <h2>{title}</h2>
      <span>{body}</span>
      <div className={styles.modalButton}>
        <button
          type="button"
          className={styles.btnLeft}
          onClick={handleCancelModal}
        >
          {btnLeft}
        </button>
        {submit ? (
          <button type="submit" onClick={handleOnClick}>
            {btnRight}
          </button>
        ) : (
          <button type="button" onClick={handleClosedComponent}>
            {btnRight}
          </button>
        )}
      </div>
    </ReactModal>
  );
}
