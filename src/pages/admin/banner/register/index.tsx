import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { TextInput } from '../../../../components/admin/TextInput';
import { QuestionModal } from '../../../../components/admin/Modal/QuestionModal';
import { registerBanner } from '../../../../services/requests/bannerRequest';
import { FileContent } from '../../../../components/admin/File';
import { SideBar } from '../../../../components/admin/SideBar';
import { ReactNotificationModal } from '../../../../components/admin/Modal/ResponseModal';
import { Switch } from '../../../../components/admin/Switch';

import styles from './styles.module.scss';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { parseCookie } from '../../../../utils/cookies';

export default function AddBannerPage() {
  const router = useRouter();
  const [desktopFile, setDesktopFile] = useState<any>();
  const [mobileFile, setMobileFile] = useState<any>();
  const [published, setPublished] = useState(false);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [link, setLink] = useState('');

  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [error, setError] = useState<string>();
  const onChangeSwitch = () => setPublished(!published);

  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const handleOpenQuestionModal = () =>
    setOpenQuestionModal(!openQuestionModal);
  const handleOpenCancelModal = () => setOpenCancelModal(!openCancelModal);

  const redirectToBannerListPage = () => router.push('/admin/banner');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('bucketName', `${process.env.S3_BUCKET_NAME}`);
    formData.append('bucketFolder', 'banner');
    formData.append('desktopImage', desktopFile);
    formData.append('mobileImage', mobileFile);
    formData.append('title', title);
    formData.append('altText', altText);
    formData.append('published', Boolean(published).toString());
    formData.append('link', link);

    const response = await registerBanner(formData);

    if (response?.error) {

      setError(response.error);
      setModalError(true);

      if(response.IsTokenError){
        router.push('/admin/login');
      }
      return;
    }
    setModalSuccess(true);
  }

  return (
    <div className={styles.container}>
      <SideBar />
      <aside className={styles.aside}>
        {modalError && (
          <ReactNotificationModal
            isOpen={modalError}
            title="Erro"
            body={String(error)}
            onClick={() => undefined}
            handleSetModal={setModalError}
          />
        )}
        {modalSuccess && (
          <ReactNotificationModal
            isOpen={modalSuccess}
            title="Seu banner foi criado!"
            body="Clique em OK para continuar."
            onClick={redirectToBannerListPage}
            handleSetModal={setModalSuccess}
          />
        )}
        <h2>Adicionar Banner</h2>
        <div className={styles.contentTop}>
          <div className={styles.column}>
            <TextInput
              type="text"
              name="title"
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextInput
              type="url"
              value={link}
              name="link"
              label="Link"
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className={styles.textarea}>
            <span>Texto Alternativo</span>
            <textarea
              name="altText"
              value={altText}
              placeholder="Descrição do Banner..."
              maxLength={140}
              required
              autoComplete="true"
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.contentBottom}>
          <div className={styles.published}>
            <p>Publicar:</p>
            <Switch valueToChange={published} onChange={onChangeSwitch} />
          </div>
          <div className={styles.contentFiles}>
            <div className={styles.image}>
              <p>Imagem Desktop</p>
              <FileContent
                fileName={desktopFile?.name}
                platform="desktopImage"
                setFile={setDesktopFile}
              />
            </div>
            <div className={styles.image}>
              <p>Imagem Mobile</p>
              <FileContent
                fileName={mobileFile?.name}
                platform="mobileImage"
                setFile={setMobileFile}
              />
            </div>
          </div>
        </div>
        <div className={styles.contentButton}>
          <button id="left" type="button" onClick={handleOpenCancelModal}>
            Cancelar
          </button>
          <QuestionModal
            open={openCancelModal}
            title="Cancelar criação"
            body="Você realmente quer cancelar a criação?"
            btnLeft="Não"
            btnRight="Sim"
            handleCancelModal={handleOpenCancelModal}
            handleClosedComponent={redirectToBannerListPage}
          />
          <button type="button" onClick={handleOpenQuestionModal}>
            Confirmar
          </button>
          <QuestionModal
            open={openQuestionModal}
            submit
            title="Criar banner"
            body="Você realmente quer criar o banner?"
            btnLeft="Voltar"
            btnRight="Confirmar"
            handleCancelModal={handleOpenQuestionModal}
            handleSubmit={handleSubmit}
          />
        </div>
      </aside>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
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
