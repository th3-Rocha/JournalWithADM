import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { FileContent } from '../../../../components/admin/File';
import { SideBar } from '../../../../components/admin/SideBar';
import { TextInput } from '../../../../components/admin/TextInput';
import { updateNews } from '../../../../services/requests/newsRequest';
import { NewsResponseProps } from '../../../../types/newsTypes';
import { Button } from '../../../../components/admin/Button';
import { QuestionModal } from '../../../../components/admin/Modal/QuestionModal';
import { parseCookie } from '../../../../utils/cookies';
import { getAPIClient } from '../../../../services/axios';
import { ReactNotificationModal } from '../../../../components/admin/Modal/ResponseModal';
import { Switch } from '../../../../components/admin/Switch';

import styles from './styles.module.scss';

type NewsEditProps = {
  news: NewsResponseProps;
};

export default function NewsEdit({ news }: NewsEditProps) {
  const router = useRouter();

  const [modalError, setModalError] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  const [file, setFile] = useState<any>();
  const [published, setPublished] = useState(news.published);
  const [title, setTitle] = useState(news.title);
  const [metaDescription, setMetaDescription] = useState(news.metaDescription);
  const [altText, setAltText] = useState(news.altText);
  const [author, setAuthor] = useState(news.author);

  const [response, setResponse] = useState<NewsResponseProps | null>();
  const [error, setError] = useState<string>();

  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const handleOpenQuestionModal = () =>
    setOpenQuestionModal(!openQuestionModal);
  const handleOpenCancelModal = () => setOpenCancelModal(!openCancelModal);
  const onChangeSwitch = () => setPublished(!published);

  const redirectToNewsListPage = async () => {
    await router.push('/admin/posts');
  };
  const redirectToNewsTextPage = async () => {
    await router.push(`/admin/posts/post-text/${response?._id}`);
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('bucketName', `${process.env.S3_BUCKET_NAME}`);
    formData.append('bucketFolder', 'news');
    formData.append('file', file);
    formData.append('title', title);
    formData.append('altText', altText);
    formData.append('published', Boolean(published).toString());
    formData.append('author', author);
    formData.append('metaDescription', metaDescription);

    const response = await updateNews(news._id, formData);

    if (response?.error) {
      setError(response.error);
      setModalError(true);
      if(response.IsTokenError){
        router.push('/admin/login');
      }
      return;
    }
    setResponse(response);
    setModalSuccess(true);
  }

  return (
    <div className={styles.container}>
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
          title="Seu post foi atualizado!"
          body="Clique em OK para continuar"
          onClick={redirectToNewsTextPage}
          handleSetModal={setModalSuccess}
        />
      )}
      <SideBar />
      <div className={styles.register}>
        <form className={styles.form}>
          <h2>Editar Post</h2>
          <div className={styles.row}>
            <TextInput
              label="Título"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextInput
              label="Autor"
              name="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className={styles.row}>
            <TextInput
              label="Texto Alternative"
              name="altText"
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
            <TextInput
              label="Meta Description"
              name="metaDescription"
              type="text"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.published}>
              <p>Publicar:</p>
              <Switch valueToChange={published} onChange={onChangeSwitch} />
            </div>

            <div className={styles.image}>
              <p>Imagem de Capa</p>
              <FileContent
                platform="image"
                fileName={file?.name}
                setFile={setFile}
              />
            </div>
          </div>

          <div className={styles.contentButton}>
            <Button label="Cancelar" left handleClick={handleOpenCancelModal} />
            <QuestionModal
              open={openCancelModal}
              title="Cancelar edição"
              body="Você realmente quer cancelar?"
              btnLeft="Não"
              btnRight="Sim"
              handleCancelModal={handleOpenCancelModal}
              handleClosedComponent={redirectToNewsListPage}
            />
            <Button label="Atualizar" handleClick={handleOpenQuestionModal} />
            <QuestionModal
              open={openQuestionModal}
              submit
              title="Salvar Post"
              body="Você realmente quer atualizar o post?"
              btnLeft="Voltar"
              btnRight="Atualizar e continuar"
              handleCancelModal={handleOpenQuestionModal}
              handleSubmit={handleSubmit}
            />
          </div>
        </form>
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
      props: { news: response.data, fallback: true },
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
