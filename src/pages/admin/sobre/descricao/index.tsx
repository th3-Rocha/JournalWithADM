import Head from 'next/head';
import { FormEvent, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { Button } from '../../../../components/admin/Button';
import { SideBar } from '../../../../components/admin/SideBar';
import { QuestionModal } from '../../../../components/admin/Modal/QuestionModal';
import { parseCookie } from '../../../../utils/cookies';
import { getAPIClient } from '../../../../services/axios';
import { ReactNotificationModal } from '../../../../components/admin/Modal/ResponseModal';
import { EditorText } from '../../../../components/admin/EditorText';
import { updateDescriptionAbout } from '../../../../services/requests/aboutRequest';
import { AboutResponseProps } from '../../../../types/aboutTypes';

import styles from './styles.module.scss';
import { PLACEHOLDER_DESCRIPTION } from '../../../../utils/placeholders';

type AboutDescriptionProps = {
  aboutData: AboutResponseProps;
};

export default function AboutDescription({ aboutData }: AboutDescriptionProps) {
  const initialDescription = aboutData?.text || PLACEHOLDER_DESCRIPTION;
  const [description, setDescription] = useState(initialDescription ?? '');

  const router = useRouter();

  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const handleOpenSaveModal = () => setOpenSaveModal(!openSaveModal);
  const handleOpenCancelModal = () => setOpenCancelModal(!openCancelModal);

  const handleBackToFirstStage = () => router.push('/admin/sobre');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await updateDescriptionAbout(description);
    if (response?.error) {
      setErrorMessage(response.error);
      setModalError(true);
       if(response.IsTokenError){
        router.push('/admin/login');
      }
      return;
    }

    setModalSuccess(true);
  };

  useEffect(() => setDescription(initialDescription ?? ''), [initialDescription]);

  return (
    <>
      <Head>
        <title>Sobre | Admin</title>
      </Head>

      {modalError && (
        <ReactNotificationModal
          isOpen={modalError}
          title="Erro"
          body={String(errorMessage)}
          onClick={() => undefined}
          handleSetModal={setModalError}
        />
      )}
      {modalSuccess && (
        <ReactNotificationModal
          isOpen={modalSuccess}
          title="Suas alterações foram salvas com sucesso!"
          body="Clique em OK para continuar"
          onClick={handleBackToFirstStage}
          handleSetModal={setModalSuccess}
        />
      )}
      <div className={styles.container}>
        <SideBar />
        <div className={styles.content}>
          <div>
            <h2>Descrição da página Sobre</h2>
            <EditorText
              initialValue={initialDescription}
              value={description}
              setValue={setDescription}
            />
            <div className={styles.contentButton}>
              <Button
                label="Cancelar"
                left
                handleClick={handleOpenCancelModal}
              />
              <QuestionModal
                open={openCancelModal}
                title="Cancelar edição"
                body="Você realmente quer cancelar?"
                btnLeft="Não"
                btnRight="Sim"
                handleCancelModal={handleOpenCancelModal}
                handleClosedComponent={handleBackToFirstStage}
              />
              <Button label="Salvar" handleClick={handleOpenSaveModal} />
              <QuestionModal
                open={openSaveModal}
                submit
                title="Salvar alterações"
                body="Você realmente quer salvar a descrição da página Sobre?"
                btnLeft="Voltar"
                btnRight="Salvar"
                handleCancelModal={handleOpenSaveModal}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const { 'nextauth.token': token } = parseCookie(ctx.req);
    const apiClient = getAPIClient(ctx);

    const response = await apiClient.get(`/about/get`);

    if (!token) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        aboutData: response.data,
        fallback: true,
      },
    };
  } catch (error: any) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
};
