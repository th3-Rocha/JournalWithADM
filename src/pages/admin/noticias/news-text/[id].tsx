import { FormEvent, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import { Button } from '../../../../components/admin/Button';
import { SideBar } from '../../../../components/admin/SideBar';
import { updateNewsText } from '../../../../services/requests/newsRequest';
import { QuestionModal } from '../../../../components/admin/Modal/QuestionModal';
import { parseCookie } from '../../../../utils/cookies';
import { getAPIClient } from '../../../../services/axios';
import { NewsResponseProps } from '../../../../types/newsTypes';
import { ReactNotificationModal } from '../../../../components/admin/Modal/ResponseModal';
import { EditorText } from '../../../../components/admin/EditorText';

import styles from './styles.module.scss';

type NewsTextProps = {
  newsData: NewsResponseProps;
};

export default function NewsText({ newsData }: NewsTextProps) {
  const initialText = newsData.text;
  const [newsText, setNewsText] = useState(initialText ?? '');
  

  const router = useRouter();
  const { id } = router.query;

  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [openBackModal, setOpenBackModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const handleOpenSaveModal = () => setOpenSaveModal(!openSaveModal);
  const handleOpenBackModal = () => setOpenBackModal(!openBackModal);
  const handleOpenCancelModal = () => setOpenCancelModal(!openCancelModal);

  const handleBackToFirstStage = () =>
    router.push(`/admin/noticias/edit/${id}`);
  const handleBackToNewsListPage = () => router.push(`/admin/noticias`);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await updateNewsText(id, newsText);

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

  useEffect(() => setNewsText(initialText ?? ''), [initialText]);

  return (
    <div className={styles.container}>
      <SideBar />
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
          title="Sua notícia foi atualizada!"
          body="Clique em OK para continuar"
          onClick={handleBackToNewsListPage}
          handleSetModal={setModalSuccess}
        />
      )}
      <div className={styles.content}>
        <div>
          <h2>Texto da Noticia</h2>
          <EditorText
            initialValue={initialText}
            value={newsText}
            setValue={setNewsText}
          />
          <div className={styles.contentButton}>
            <Button label="Voltar" left handleClick={handleOpenBackModal} />
            <QuestionModal
              open={openBackModal}
              title="Voltar para a primeira etapa"
              body="Você realmente deseja voltar para a primeira etapa? Qualquer dado não salvo desta página será perdido."
              btnLeft="Não"
              btnRight="Sim"
              handleCancelModal={handleOpenBackModal}
              handleClosedComponent={handleBackToFirstStage}
            />
            <Button label="Cancelar" left handleClick={handleOpenCancelModal} />
            <QuestionModal
              open={openCancelModal}
              title="Cancelar criação"
              body="Você realmente quer cancelar?"
              btnLeft="Não"
              btnRight="Sim"
              handleCancelModal={handleOpenCancelModal}
              handleClosedComponent={handleBackToNewsListPage}
            />
            <Button label="Salvar" handleClick={handleOpenSaveModal} />
            <QuestionModal
              open={openSaveModal}
              submit
              title="Salvar notícia"
              body="Você realmente quer salvar a notícia?"
              btnLeft="Voltar"
              btnRight="Salvar"
              handleCancelModal={handleOpenSaveModal}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const { 'nextauth.token': token } = parseCookie(ctx.req);
   
    const { id } = ctx.query;
    const apiClient = getAPIClient(ctx);
    const response = await apiClient.get(`/news/get/${id}`);

    if (!token) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }

    return {
      props: { newsData: response.data, fallback: true },
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
