import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { FileContent } from '../../../../components/admin/File';
import { SideBar } from '../../../../components/admin/SideBar';
import { TextInput } from '../../../../components/admin/TextInput';
import { registerNews } from '../../../../services/requests/newsRequest';
import { NewsResponseProps } from '../../../../types/newsTypes';
import { Button } from '../../../../components/admin/Button';
import { QuestionModal } from '../../../../components/admin/Modal/QuestionModal';
import { parseCookie } from '../../../../utils/cookies';
import { ReactNotificationModal } from '../../../../components/admin/Modal/ResponseModal';
import { Switch } from '../../../../components/admin/Switch';

import styles from './styles.module.scss';

export default function NewsRegister() {
  const router = useRouter();

  const [modalError, setModalError] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [createdNews, setCreatedNews] = useState<NewsResponseProps | null>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const [selectedFile, setSelectedFile] = useState<any>();
  const [published, setPublished] = useState(false);
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [altText, setAltText] = useState('');
  const [author, setAuthor] = useState('');

  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const handleOpenQuestionModal = () =>
    setOpenQuestionModal(!openQuestionModal);
  const handleOpenCancelModal = () => setOpenCancelModal(!openCancelModal);
  const onChangeSwitch = () => setPublished(!published);

  const redirectToNewsListPage = async () => {
    await router.push('/admin/noticias');
  };
  const redirectToNewsTextPage = async () => {
    await router.push(`/admin/noticias/news-text/${createdNews?._id!}`);
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('bucketName', `${process.env.S3_BUCKET_NAME}`);
    formData.append('bucketFolder', 'news');
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('altText', altText);
    formData.append('published', Boolean(published).toString());
    formData.append('author', author);
    formData.append('metaDescription', metaDescription);
    formData.append('post', Boolean(false).toString());

    
    const response = await registerNews(formData);

    if (response?.error) {
      setErrorMessage(response.error);
      setModalError(true);
      if(response.IsTokenError){
        router.push('/admin/login');
      }
      return;
    }
    setCreatedNews(response);
    setModalSuccess(true);
  }

  return (
    <div className={styles.container}>
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
          title="Sua notícia foi criada"
          body="Clique em OK para continuar com a edição da notícia."
          onClick={redirectToNewsTextPage}
          handleSetModal={setModalSuccess}
        />
      )}
      <SideBar />
      <div className={styles.register}>
        <form className={styles.form}>
          <h2>Cadastrar Notícia</h2>
          <div className={styles.row}>
            <TextInput
              label="Título"
              name="title"
              type="text"
              value={title}
              maxLength={100}
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
            <div className={styles.textArea}>
              <span>Texto Alternativo</span>
              <textarea
                name="altText"
                value={altText}
                maxLength={140}
                required
                autoComplete="true"
                onChange={(e) => setAltText(e.target.value)}
              />
            </div>
            <div className={styles.textArea}>
              <span>Meta Description</span>
              <textarea
                name="metaDescription"
                value={metaDescription}
                maxLength={160}
                required
                autoComplete="true"
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.published}>
              <span>Publicar:</span>
              <Switch valueToChange={published} onChange={onChangeSwitch} />
            </div>

            <div className={styles.image}>
              <span>Imagem de Capa</span>
              <FileContent
                platform="image"
                fileName={selectedFile?.name}
                setFile={setSelectedFile}
              />
            </div>
          </div>

          <div className={styles.contentButton}>
            <Button label="Cancelar" left handleClick={handleOpenCancelModal} />
            <QuestionModal
              open={openCancelModal}
              title="Cancelar criação"
              body="Você realmente quer cancelar?"
              btnLeft="Não"
              btnRight="Sim"
              handleCancelModal={handleOpenCancelModal}
              handleClosedComponent={redirectToNewsListPage}
            />
            <Button label="Criar" handleClick={handleOpenQuestionModal} />
            <QuestionModal
              open={openQuestionModal}
              submit
              title="Criar Notícia"
              body="Você realmente quer criar a notícia?"
              btnLeft="Voltar"
              btnRight="Criar e continuar"
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

    if (!token) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }

    return {
      props: {},
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
