import ReactModal from 'react-modal';

import { ErrorIcon, SuccessIcon } from '../../../Icons';

import styles from './styles.module.scss';

type NotificationModalProps = {
  isOpen: boolean;
  title: string;
  body: string;
  handleSetModal: any;
  onClick: any;
};

export function ReactNotificationModal(props: NotificationModalProps) {
  const setModal = () => {
    props.handleSetModal(!props.isOpen);
  };

  const handleOnClick = () => {
    setModal();
    props.onClick();
  };

  return (
    <ReactModal
      isOpen={props.isOpen}
      onRequestClose={setModal}
      className={styles.modal}
      overlayClassName={styles.overlay}
      ariaHideApp={false}
    >
      {props.title === 'Erro' ? <ErrorIcon /> : <SuccessIcon />}
      <p>{props.title}</p>
      <span>{props.body}</span>
      <div className={styles.modaButton}>
        <button id="left" type="button" onClick={handleOnClick}>
          Ok
        </button>
      </div>
    </ReactModal>
  );
}
