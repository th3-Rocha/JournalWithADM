import { useState } from 'react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

import { ActionIcon } from '../../Icons';
import { QuestionModal } from '../Modal/QuestionModal';
import { ReactNotificationModal } from '../Modal/ResponseModal';

import styles from './styles.module.scss';

type ActionMenuProps = {
  id: string;
  modalTitle: string;
  modalBody: string;
  titleForDeleteSuccessModal: string;
  shouldShowCopyLink: boolean;
  updatePage: (id: string) => void;
  deleteFunction: (id: string) => void;
  viewPage: (id: string) => void;
  deleteSuccessPath: () => void;
};

export function ActionMenu({
  id,
  updatePage,
  viewPage,
  deleteFunction,
  deleteSuccessPath,
  titleForDeleteSuccessModal,
  modalTitle,
  modalBody,
  shouldShowCopyLink,
}: ActionMenuProps) {
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
  const [deleteFailureModal, setDeleteFailureModal] = useState({
    state: false,
    error: '',
  });

  const handleOpenModalDelete = () => setOpenModalDelete(!openModalDelete);
  const handleOnClickView = () => viewPage(id);
  const handleOnClickUpdate = () => updatePage(id);
  const handleOnClickCopy = () => {
    let copyUrl = process.env.NEXT_PUBLIC_URL_FRONTEND + "/noticias/" + id 
    navigator.clipboard.writeText(copyUrl)
  };


  async function handleDelete() {
    const response: any = await deleteFunction(id);

    if (response?.error!) {
      setDeleteFailureModal({ state: true, error: response.error! });
      return;
    }

    setDeleteSuccessModal(true);
  }

  return (
    <div className={styles.container}>
      <Menu
        menuButton={
          <MenuButton>
            <ActionIcon />
          </MenuButton>
        }
        align = "end"
        direction='left'
        arrow
        transition
      >
        <MenuItem onClick={handleOnClickView}>Ver</MenuItem>
        <MenuItem onClick={handleOnClickUpdate}>Editar</MenuItem>
        <MenuItem onClick={handleOpenModalDelete}>Excluir</MenuItem>
        {shouldShowCopyLink && (
          <MenuItem onClick={handleOnClickCopy}>Copiar Link</MenuItem>
        )}
      </Menu>
      <QuestionModal
        btnLeft="Voltar"
        btnRight="Deletar"
        title={modalTitle}
        body={modalBody}
        submit
        handleSubmit={handleDelete}
        handleCancelModal={handleOpenModalDelete}
        open={openModalDelete}
      />
      {deleteSuccessModal && (
        <ReactNotificationModal
          isOpen={deleteSuccessModal}
          title={titleForDeleteSuccessModal}
          body="Clique em OK para continuar."
          onClick={deleteSuccessPath}
          handleSetModal={setDeleteSuccessModal}
        />
      )}
      {deleteFailureModal && (
        <ReactNotificationModal
          isOpen={deleteFailureModal.state}
          title="Erro"
          body={deleteFailureModal.error}
          onClick={() => undefined}
          handleSetModal={setDeleteFailureModal}
        />
      )}
    </div>
  );
}
