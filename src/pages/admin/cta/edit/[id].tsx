import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useRef, useState } from 'react';

import { Button } from '../../../../components/admin/Button';
import { QuestionModal } from '../../../../components/admin/Modal/QuestionModal';
import { ReactNotificationModal } from '../../../../components/admin/Modal/ResponseModal';
import { SideBar } from '../../../../components/admin/SideBar';
import { TextInput } from '../../../../components/admin/TextInput';
import { FileUploadIcon } from '../../../../components/Icons';
import { getAPIClient } from '../../../../services/axios';
import { updateCTA } from '../../../../services/requests/ctaRequest';
import { CTAResponse } from '../../../../types/CTATypes';
import { parseCookie } from '../../../../utils/cookies';

import styles from './styles.module.scss';

interface EditCTAProps {
  data: CTAResponse;
}

export default function EditCTA({ data }: EditCTAProps) {
  const router = useRouter();
  const formRef = useRef<any>();
  const [file, setFile] = useState<any>();

  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState({ state: false, error: '' });

  const handleOpenQuestionModal = () =>
    setOpenQuestionModal(!openQuestionModal);
  const handleOpenCancelModal = () => setOpenCancelModal(!openCancelModal);

  const redirectToCTAListPage = async () => {
    await router.push('/admin/cta');
  };

  async function handleSubmitCTA(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(formRef.current);
    const response = await updateCTA(data._id, formData);

    if (response?.error) {
      setModalError({ state: true, error: response.error });
      if(response.IsTokenError){
        router.push('/admin/login');
      }
      return;
    }
    setModalSuccess(true);
  }

  return (
    <>
      <Head>
        <title>CTA | Admin</title>
      </Head>

      {modalError && (
        <ReactNotificationModal
          isOpen={modalError.state}
          title="Erro"
          body={String(modalError.error)}
          onClick={() => undefined}
          handleSetModal={setModalError}
        />
      )}
      {modalSuccess && (
        <ReactNotificationModal
          isOpen={modalSuccess}
          title="Suas alterações foram salvas com sucesso"
          body="Clique em OK para continuar."
          onClick={redirectToCTAListPage}
          handleSetModal={setModalSuccess}
        />
      )}

      <div className={styles.container}>
        <SideBar />

        <main>
          <form ref={formRef}>
            <h2>Editar CTA</h2>
            <div className={styles.row}>
              <input
                type="hidden"
                name="bucketName"
                id="bucketName"
                value={process.env.S3_BUCKET_NAME}
              />
              <input
                type="hidden"
                name="bucketFolder"
                id="bucketFolder"
                value="cta"
              />
              <TextInput
                label="Título"
                defaultValue={data?.title}
                name="title"
              />
              <TextInput
                label="Texto do botão"
                defaultValue={data?.buttonText}
                name="buttonText"
              />
            </div>
            <div className={styles.row}>
              <TextInput
                label="Texto alternativo"
                defaultValue={data?.file.altText}
                name="altText"
              />
              <TextInput
                label="Link do botão"
                defaultValue={data?.path}
                name="path"
              />
            </div>
            <div className={styles.fileContainer}>
              <span>Upload da imagem</span>
              <div className={styles.upload}>
                <label htmlFor="file-cta">
                  <FileUploadIcon />
                  <input
                    accept="image/*"
                    type="file"
                    id="file-cta"
                    name="file"
                    hidden
                    onChange={(e) =>
                      e.target.files instanceof FileList &&
                      setFile(e.target.files[0])
                    }
                  />
                </label>
                <div className={styles.fileName}>
                  {file?.name || data?.file.imageName || ''}
                </div>
              </div>
            </div>
            <div className={styles.ctaDescription}>
              <span>Descrição</span>
              <textarea name="text" defaultValue={data?.text} />
            </div>

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
                handleClosedComponent={redirectToCTAListPage}
              />
              <Button label="Salvar" handleClick={handleOpenQuestionModal} />
              <QuestionModal
                open={openQuestionModal}
                submit
                title="Salvar edição"
                body="Você realmente quer salvar as modificações?"
                btnLeft="Voltar"
                btnRight="Salvar"
                handleCancelModal={handleOpenQuestionModal}
                handleSubmit={handleSubmitCTA}
              />
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const apiClient = getAPIClient(ctx);

    const { 'nextauth.token': token } = parseCookie(ctx.req);
    const { id } = ctx.query;

    const response = await apiClient.get(`/cta/get/${id}`);

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
        data: response?.data || null,
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
