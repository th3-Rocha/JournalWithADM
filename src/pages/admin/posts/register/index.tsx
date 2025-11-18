import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, SetStateAction, useEffect, useState } from 'react';
import { FileContent } from '../../../../components/admin/File';
import { SideBar } from '../../../../components/admin/SideBar';
import { TextInput } from '../../../../components/admin/TextInput';
import { registerNews } from '../../../../services/requests/newsRequest';
import { addPostToGroup } from '../../../../services/requests/newsRequest';

import { NewsResponseProps } from '../../../../types/newsTypes';
import { Button } from '../../../../components/admin/Button';
import { Dropdown } from '../../../../components/admin/DropDown';
import { QuestionModal } from '../../../../components/admin/Modal/QuestionModal';
import { parseCookie } from '../../../../utils/cookies';
import { ReactNotificationModal } from '../../../../components/admin/Modal/ResponseModal';
import { Switch } from '../../../../components/admin/Switch';

import styles from './styles.module.scss';



export default function NewsRegister() {
  const initialGroups = [
    {name: '', groupId: ''},
  ];
  
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const handleDropdownChange = (groupId: SetStateAction<string>) => {
    setSelectedGroupId(groupId);
  };
  
  const [groups, setGroups] = useState(initialGroups);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      initialGroups.pop();
      const groupsResponse = await fetch(process.env.NEXT_PUBLIC_URL_API_BACKEND + '/postgroups/list');
      if (!groupsResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      const groupList = await groupsResponse.json();
      for(let i = 0; i < groupList.length; i++){
        let newItem =  {name:groupList[i].title, groupId:groupList[i]._id}
        initialGroups.push(newItem);
      }
      setLoading(false);
      setGroups(initialGroups);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchDataAndVerifyGroups = async () => {
        try {
            await fetchData();
            if (groups.length === 0) {
                //setErrorRouter(redirectToNewGroup)
                setError("Ainda não existe nenhum grupo de posts. Deseja criar um grupo?");
                setModalError(true);
                
            }
        } catch (error) {
            setErrorRouter(doNothingRouter)
            console.error("Error fetching data:", error);
        }
    };

    fetchDataAndVerifyGroups();
}, []);


  const router = useRouter();
  let groupId = router.query.var;

  const redirectToNewsListPage = async () => {
    await router.push('/admin/posts');
  };
  const redirectToNewsTextPage = async () => {
    await router.push(`/admin/posts/post-text/${createdPost?._id!}`);
  };

  const redirectToNewGroup = async () => {
    await router.push(`/admin/groups/register`);
  };

  const doNothingRouter = async () => {
    return;
  };


  const [modalError, setModalError] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [createdPost, setCreatedPost] = useState<NewsResponseProps | null>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [errorRouter, setErrorRouter] = useState(doNothingRouter);
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
  
  


  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const postId = await handleCreationPostReturnId();
      if(postId == "undefined"){
        
        return;
      }
      await handlePostToGroup(postId);
      setModalSuccess(true);
    } catch (error) {
      if(error){
       
      }
    }
  }
  
  async function handleCreationPostReturnId() {
    const formData = new FormData();
    formData.append('bucketName', `${process.env.S3_BUCKET_NAME}`);
    formData.append('bucketFolder', 'news');
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('altText', altText);
    formData.append('published', Boolean(published).toString());
    formData.append('author', author);
    formData.append('metaDescription', metaDescription);
    formData.append('groupId', selectedGroupId);
    formData.append('post', Boolean(true).toString());  
    const response = await registerNews(formData);
    setCreatedPost(response);
    return response._id;
  
  }
  
  async function handlePostToGroup(postId: string) {
  
    const formDataGroup = new FormData();
  
    formDataGroup.append('groupId', selectedGroupId);
    const responseGroup = await addPostToGroup(postId, formDataGroup);
    
    
    if (responseGroup?.error) {
      setErrorMessage(responseGroup.error);
      setModalError(true);
      if(responseGroup.IsTokenError){
        router.push('/admin/login');
      }
      return;
    }
  
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
          title="Seu post foi criado"
          body="Clique em OK para continuar com a edição do post."
          onClick={redirectToNewsTextPage}
          handleSetModal={setModalSuccess}
        />
      )}
      <SideBar />
      <div className={styles.register}>
        <form className={styles.form}>
          <h2>Cadastrar Post</h2>
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
          <div className={styles.textArea}>
            {loading ? (
              <div>
                  <h1>loading</h1>
                </div>
              ) : (<Dropdown grupos ={groups} onSelectChange={handleDropdownChange} firstSelectedId={groupId}  />
                )}
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
              title="Criar Post"
              body="Você realmente quer criar a post?"
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
