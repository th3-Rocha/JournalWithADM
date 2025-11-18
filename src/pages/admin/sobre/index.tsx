import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FormEvent, useRef, useState } from 'react';

import { Button } from '../../../components/admin/Button';
import { QuestionModal } from '../../../components/admin/Modal/QuestionModal';
import { ReactNotificationModal } from '../../../components/admin/Modal/ResponseModal';
import { SideBar } from '../../../components/admin/SideBar';
import { TextInput } from '../../../components/admin/TextInput';
import { FileUploadIcon } from '../../../components/Icons';
import { getAPIClient } from '../../../services/axios';
import { updateInfoAbout } from '../../../services/requests/aboutRequest';
import { AboutResponseProps } from '../../../types/aboutTypes';
import { parseCookie } from '../../../utils/cookies';

import styles from './styles.module.scss';

interface AboutPageProps {
  aboutData: AboutResponseProps;
  fallback: boolean;
}

export default function About({ aboutData }: AboutPageProps) {
  const formRef = useRef<any>();
  const router = useRouter();
  const [inputDisabled, setInputDisabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>();

  const [modalError, setModalError] = useState({ state: false, error: '' });
  const [modalSuccess, setModalSuccess] = useState(false);
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const handleOpenQuestionModal = () =>
    setOpenQuestionModal(!openQuestionModal);
  const handleOpenCancelModal = () => setOpenCancelModal(!openCancelModal);
  const handleEnableEditing = () => {
    setInputDisabled(!inputDisabled);
    setOpenCancelModal(false);
  };

  const redirectToAboutPage = async () => {
    await router.push('/admin/sobre/descricao');
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(formRef.current);

    const response = await updateInfoAbout(formData);

    if (response.error) {
      setModalError({ state: true, error: response.error });
      if(response.IsTokenError){
        router.push('/admin/login');
      }
      return;
    }
    setModalSuccess(true);
    setInputDisabled(false);
  }

  return (
    <>
      <Head>
        <title>Sobre | Admin</title>
      </Head>

      {modalError.state && (
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
          title="Informações da página Sobre atualizadas!"
          body="Clique em OK para continuar."
          onClick={redirectToAboutPage}
          handleSetModal={setModalSuccess}
        />
      )}

      <div className={styles.container}>
        <SideBar />
        <main>
          <form ref={formRef}>
            <h2>Sobre</h2>
            <div className={styles.title}>
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
                value="about"
              />
              <TextInput
                label="Título"
                id="title"
                name="title"
                defaultValue={aboutData?.title}
                disabled={!inputDisabled}
              />
            </div>
            <div className={styles.row}>
              <TextInput
                label="Texto alternativo"
                id="altText"
                name="altText"
                defaultValue={aboutData?.file?.altText}
                disabled={!inputDisabled}
              />
              <div className={styles.fileUpload}>
                <span>Arquivo de imagem</span>
                <div>
                  <label htmlFor="file">
                    <FileUploadIcon />
                    <input
                      accept="image/*"
                      type="file"
                      id="file"
                      name="file"
                      hidden
                      disabled={!inputDisabled}
                      onChange={(e) =>
                        e.target.files instanceof FileList &&
                        setSelectedFile(e.target.files[0])
                      }
                    />
                  </label>
                  <div className={styles.fileName}>
                    {selectedFile?.name || aboutData?.file?.imageName || ''}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.image}>
              <Image
                src={aboutData?.file?.url}
                height={300}
                width={440}
                alt="Imagem da página Sobre"
                objectFit="cover"
              />
            </div>
            <div className={styles.contentButton}>
              {!inputDisabled ? (
                <Button
                  label="Editar"
                  name="laboratoryName"
                  handleClick={handleEnableEditing}
                />
              ) : (
                <>
                  <Button
                    label="Cancelar"
                    left
                    handleClick={handleOpenCancelModal}
                  />
                  <QuestionModal
                    open={openCancelModal}
                    title="Cancelar Edição"
                    body="Você realmente quer cancelar?"
                    btnLeft="Não"
                    btnRight="Sim"
                    handleCancelModal={handleOpenCancelModal}
                    handleClosedComponent={handleEnableEditing}
                  />
                  <Button
                    label="Atualizar e Continuar"
                    type="submit"
                    id="confirm"
                    handleClick={handleOpenQuestionModal}
                  />
                  <QuestionModal
                    open={openQuestionModal}
                    submit
                    title="Atualizar Sobre"
                    body="Você realmente quer atualizar as informações da página Sobre?"
                    btnLeft="Voltar"
                    btnRight="Confirmar"
                    handleCancelModal={handleOpenQuestionModal}
                    handleSubmit={handleSubmit}
                  />
                </>
              )}
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
    const { 'nextauth.token': token } = parseCookie(ctx.req);
    const apiClient = getAPIClient(ctx);

    const response = await apiClient.get<AboutResponseProps>(
      `/about/get`
    );

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
