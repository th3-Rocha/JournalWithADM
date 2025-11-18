import React, { FormEvent, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import { BannerResponseProps } from '../../../../types/bannerTypes';
import { TextInput } from '../../../../components/admin/TextInput';
import { QuestionModal } from '../../../../components/admin/Modal/QuestionModal';
import { FileContent } from '../../../../components/admin/File';
import { updateBanner } from '../../../../services/requests/bannerRequest';
import { SideBar } from '../../../../components/admin/SideBar';
import { parseCookie } from '../../../../utils/cookies';
import { getAPIClient } from '../../../../services/axios';
import { ReactNotificationModal } from '../../../../components/admin/Modal/ResponseModal';
import { Switch } from '../../../../components/admin/Switch';

import styles from './styles.module.scss';

type EditBannerProps = {
  data: BannerResponseProps;
};

export default function EditBannerPage({ data }: EditBannerProps) {
  const router = useRouter();
  const [desktopFile, setDesktopFile] = useState<any>();
  const [mobileFile, setMobileFile] = useState<any>();
  const [published, setPublished] = useState(data?.published);
  const [title, setTitle] = useState(data?.title);
  const [altText, setAltText] = useState(data?.altText);
  const [link, setLink] = useState(data?.link);

  const [error, setError] = useState<string>();
  const [modalError, setModalError] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const handleOpenQuestionModal = () =>
    setOpenQuestionModal(!openQuestionModal);
  const handleOpenCancelModal = () => setOpenCancelModal(!openCancelModal);
  const onChangeSwitch = () => setPublished(!published);
  const redirectToBannerListPage = async () => {
    await router.push('/admin/banner');
  };

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

    const response = await updateBanner(data?._id, formData);

    if (response.error) {
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
      <aside className={styles.pageContent}>
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
            title="Seu banner foi salvo!"
            body="Clique em OK para continuar."
            onClick={redirectToBannerListPage}
            handleSetModal={setModalSuccess}
          />
        )}
        <h2>Editar banner</h2>
        <div className={styles.top}>
          <div>
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
        <div className={styles.bottom}>
          <div className={styles.published}>
            <p>Publicar:</p>
            <Switch valueToChange={published} onChange={onChangeSwitch} />
          </div>
          <div className={styles.file}>
            <div>
              <p>Imagem Desktop</p>
              <FileContent
                imageName={desktopFile?.name}
                fileName={data?.desktopImage.imageName}
                platform="desktopImage"
                setFile={setDesktopFile}
              />
            </div>
            <div>
              <p>Imagem Mobile</p>
              <FileContent
                imageName={mobileFile?.name}
                fileName={data?.mobileImage.imageName}
                platform="mobileImage"
                setFile={setMobileFile}
              />
            </div>
          </div>
        </div>
        <div className={styles.button}>
          <button id="left" type="button" onClick={handleOpenCancelModal}>
            Cancelar
          </button>
          <QuestionModal
            open={openCancelModal}
            title="Cancelar edição"
            body="Você realmente quer cancelar?"
            btnLeft="Não"
            btnRight="Sim"
            handleCancelModal={handleOpenCancelModal}
            handleClosedComponent={redirectToBannerListPage}
          />
          <button type="button" onClick={handleOpenQuestionModal}>
            Salvar
          </button>
          <QuestionModal
            open={openQuestionModal}
            submit
            title="Salvar banner"
            body="Você realmente quer salvar o banner?"
            btnLeft="Voltar"
            btnRight="Salvar"
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
    const { id } = ctx.query;
    const apiClient = getAPIClient(ctx);

    const response = await apiClient.get(`/banner/get/${id}`);

    if (!token) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }

    return {
      props: { data: response.data, fallback: true },
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
