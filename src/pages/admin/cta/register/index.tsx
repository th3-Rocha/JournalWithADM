import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useRef, useState } from 'react';

import { Button } from '../../../../components/admin/Button';
import { QuestionModal } from '../../../../components/admin/Modal/QuestionModal';
import { ReactNotificationModal } from '../../../../components/admin/Modal/ResponseModal';
import { SideBar } from '../../../../components/admin/SideBar';
import { TextInput } from '../../../../components/admin/TextInput';
import { FileUploadIcon } from '../../../../components/Icons';
import { registerCTA } from '../../../../services/requests/ctaRequest';
import { parseCookie } from '../../../../utils/cookies';

import styles from './styles.module.scss';

export default function RegisterCTA() {
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
    const response = await registerCTA(formData);

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
          title="Seu CTA foi criado"
          body="Clique em OK para continuar."
          onClick={redirectToCTAListPage}
          handleSetModal={setModalSuccess}
        />
      )}

      <div className={styles.container}>
        <SideBar />

        <main>
          <form ref={formRef}>
            <h2>Adicionar CTA</h2>
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
              <TextInput label="Título" name="title" />
              <TextInput label="Texto do botão" name="buttonText" />
            </div>
            <div className={styles.row}>
              <TextInput label="Texto alternativo" name="altText" />
              <TextInput label="Link do botão" name="path" />
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
                <div className={styles.fileName}>{file?.name || ''}</div>
              </div>
            </div>
            <div className={styles.ctaDescription}>
              <span>Descrição</span>
              <textarea name="text" />
            </div>

            <div className={styles.contentButton}>
              <Button
                label="Cancelar"
                left
                handleClick={handleOpenCancelModal}
              />
              <QuestionModal
                open={openCancelModal}
                title="Cancelar criação"
                body="Você realmente quer cancelar?"
                btnLeft="Não"
                btnRight="Sim"
                handleCancelModal={handleOpenCancelModal}
                handleClosedComponent={redirectToCTAListPage}
              />
              <Button label="Criar" handleClick={handleOpenQuestionModal} />
              <QuestionModal
                open={openQuestionModal}
                submit
                title="Criar CTA"
                body="Você realmente quer criar o CTA?"
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { 'nextauth.token': token } = parseCookie(ctx.req);

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
