import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { SideBar } from '../../../../components/admin/SideBar';

import { registerGroup } from '../../../../services/requests/groupsRequest';
import { NewsResponseProps } from '../../../../types/newsTypes';
import { Button } from '../../../../components/admin/Button';

import { Tooltip } from '../../../../components/admin/Tooltip';

import { QuestionModal } from '../../../../components/admin/Modal/QuestionModal';
import { parseCookie } from '../../../../utils/cookies';
import { ReactNotificationModal } from '../../../../components/admin/Modal/ResponseModal';
import { Switch } from '../../../../components/admin/Switch';
import { TextInput } from '../../../../components/admin/TextInput';
import styles from './styles.module.scss';

export default function GroupsRegister() {
  const router = useRouter();

  const [modalError, setModalError] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [response, setResponse] = useState<NewsResponseProps | null>();
  const [error, setError] = useState<string>();

  const [title, setTitle] = useState('');
  const [showNavbar, setShowNavbar] = useState(true);
  const [metaDescription, setMetaDescription] = useState('');
  const [published, setPublished] = useState(false);
  const [url, setUrl] = useState('');
  //group Post Variables
  const [postCover, setPostCover] = useState(true);
  const [postDate, setPostDate] = useState(true);
  const [postText, setPostText] = useState(true);
  const [postTitle, setPostTitle] = useState(true);

  //set FormVariables
  const [valueTitle, setValueTitle] = useState('');
  const [valueMetaDescription, setValueMetaDescription] = useState('');
  const [valueUrl, setValueUrl] = useState('');
  
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const handleOpenQuestionModal = () =>
    setOpenQuestionModal(!openQuestionModal);
  const handleOpenCancelModal = () => setOpenCancelModal(!openCancelModal);
  const onChangeSwitchPublished = () => setPublished(!published);
  const onChangeSwitchShowNavbar= () => setShowNavbar(!showNavbar);
  const onChangeSwitchPostCover= () => setPostCover(!postCover);
  const onChangeSwitchPostDate= () => setPostDate(!postDate);
  const onChangeSwitchPostTitle= () => setPostTitle(!postTitle);
  const onChangeSwitchPostText= () => setPostText(!postText);

  const redirectToHome = async () => {
    await router.push('/admin/home');
  };
  const redirectToGroups = async () => {
    await router.push('/admin/home');
  };



  function removeSpecialCharacters(str: string) {
    return str
      .replace(/[^\w\s]/gi, '') // remove caracteres especiais
      .replace(/\s+/g, ''); // remove espaços
  }





  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if(!valueTitle){
      setError("Prencha o campo Título");
      setModalError(true);
      return;
    }
    
    let removeSpecialStr = removeSpecialCharacters(valueTitle);
    
    let strUrl = "https://laperme.musica.ufrn.br/" + removeSpecialStr;
    if(!valueMetaDescription){
      setError("Prencha o campo Meta Description");
      setModalError(true);
      return;
    }

    const formData = new FormData();
    formData.append('title', valueTitle);
    formData.append('metaDescription', valueMetaDescription);
    formData.append('published', Boolean(published).toString());
    formData.append('url', strUrl);
    formData.append('showNavbar', Boolean(showNavbar).toString());
    formData.append('postCover', Boolean(postCover).toString());
    formData.append('postDate', Boolean(postDate).toString());
    formData.append('postText', Boolean(postText).toString());
    formData.append('postTitle', Boolean(postTitle).toString());

    const response = await registerGroup(formData);
    


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
          title="Seu Grupo foi criado"
          body="Clique em OK para continuar com a edição do Grupo."
          onClick={redirectToGroups}
          handleSetModal={setModalSuccess}
        />
      )}
      <SideBar />
      <div className={styles.register}>
        <form className={styles.form}>
          <h2>Cadastrar Grupo</h2>
          <div className={styles.row}>
            <TextInput 
              label="Título"
              name="title"
              placeholder='Título'
              tooltipText='Campo para o Título do grupo'
              type="text"
              maxLength={100}
              onChange={(e) => setValueTitle(e.target.value)}
            />
            <TextInput
              label="Url"
              name="url"
              placeholder='Url'
              tooltipText='Campo para a url do grupo'
              type="text"
              value={"https://laperme.musica.ufrn.br/" + removeSpecialCharacters(valueTitle)}
              disabled
            />

          
          </div>
          <div className={styles.row}>
            
            <div className={styles.textArea}>
              <div className={styles.title}>
                <span>Meta Description</span>
                <Tooltip tooltip='Meta-Drescription do grupo' />
              </div>
             
              <textarea
                name="metaDescription"
                placeholder='Meta Description'
                maxLength={160}
                required
                autoComplete="true"
                onChange={(e) => setValueMetaDescription(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.row}>

            <div className={styles.published}>
              <span>Publicar Grupo:</span>
              <Switch valueToChange={published} onChange={onChangeSwitchPublished} />
            </div>

            <div className={styles.published}>
              <span>Mostar na NavBar:</span>
              <Switch valueToChange={showNavbar} onChange={onChangeSwitchShowNavbar} />
            </div>

            <div className={styles.published}>
              <span>Mostar Imagem dos Posts:</span>
              <Switch valueToChange={postCover} onChange={onChangeSwitchPostCover} />
            </div>

            <div className={styles.published}>
              <span>Mostar Data dos Posts:</span>
              <Switch valueToChange={postDate} onChange={onChangeSwitchPostDate} />
            </div>

            <div className={styles.published}>
              <span>Mostar Título dos Posts:</span>
              <Switch valueToChange={postTitle} onChange={onChangeSwitchPostTitle} />
            </div>

            <div className={styles.published}>
              <span>Mostar Texto dos Posts:</span>
              <Switch valueToChange={postText} onChange={onChangeSwitchPostText} />
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
              handleClosedComponent={redirectToHome}
            />
            <Button label="Criar" handleClick={handleOpenQuestionModal} />
            <QuestionModal
              open={openQuestionModal}
              submit
              title="Criar Grupo"
              body="Você realmente quer criar o Grupo?"
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
