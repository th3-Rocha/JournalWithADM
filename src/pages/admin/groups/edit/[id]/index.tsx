import Head from 'next/head';
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  Table,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Switch } from '../../../../../components/admin/Switch';

import { TextInput } from '../../../../../components/admin/TextInput';
import { usePagination } from '../../../../../contexts/usePagination';
import { SideBar } from '../../../../../components/admin/SideBar';
import { TableToolbar } from '../../../../../components/admin/Table/TableToolBar';
import { TableHeadContainer } from '../../../../../components/admin/Table/TableHead';
import { getAllPaginatedNewsOfGroup } from '../../../../../services/requests/newsRequest';
import { getOneGroup } from '../../../../../services/requests/groupsRequest';
import { FormEvent } from 'react';
import { deleteGroup } from  '../../../../../services/requests/groupsRequest'; //pathgroup
import { updateGroup } from '../../../../../services/requests/groupsRequest'; //pathgroup
import styles from './styles.module.scss';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getAPIClient } from '../../../../../services/axios';
import { parseCookie } from '../../../../../utils/cookies';
import { NewsProps } from '../../../../../types/newsTypes';
import { useRouter } from 'next/router';
import { NewsResponseProps } from '../../../../../types/newsTypes';
import { GroupsResponseProps } from '../../../../../types/groupsTypes';
import { FooterResponseProps } from '../../../../../types/footerTypes';
import { Button } from '../../../../../components/admin/Button';
import { ButtonRemove } from '../../../../../components/admin/ButtonRemove';
import { QuestionModal } from '../../../../../components/admin/Modal/QuestionModal';
import { ReactNotificationModal } from '../../../../../components/admin/Modal/ResponseModal';
import React from 'react';


const headColumns = [
  {
    id: 'title',
    label: 'Título',
  },
  {
    id: 'author',
    label: 'Autor',
  },
  {
    id: 'published',
    label: 'Publicado',
  },
];

type Response = {
  response: Array<NewsResponseProps>;
  nextPage?: {
    page: number;
    limit: number;
  };
  previousPage?: {
    page: number;
    limit: number;
  };
  totalPages: number;
};



export default function News({ data, fallback}: NewsProps) {

  const router = useRouter();
  const { id } = router.query;
  
  const [info, setInfo] = useState<Response>();
  const [groupInfo, setGroupInfo] = useState<GroupsResponseProps>();
  const [loading, setLoading] = useState(false);

  const [modalError, setModalError] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [RedirectionHome, setRedirectionHome] = useState(true);
  const [modalExistsPosts, setModalExistsPosts] = useState(false);
  const [response, setResponse] = useState<NewsResponseProps | null>();
  const [error, setError] = useState<string>();

  //set GroupVariables
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [url, setUrl] = useState('');
  const [postsId, setPostsId] = useState([]);

  // FormAndGroupVariables (Booleans)
  const [showNavbar, setShowNavbar] = useState(true);
  const [published, setPublished] = useState(true);
  const [postCover, setPostCover] = useState(true);
  const [postDate, setPostDate] = useState(true);
  const [postText, setPostText] = useState(true);
  const [postTitle, setPostTitle] = useState(true);
  //set FormVariables
  const [valueTitle, setValueTitle] = useState('');
  const [valueMetaDescription, setValueMetaDescription] = useState('');
  const [valueUrl, setValueUrl] = useState('');

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      const response = await getAllPaginatedNewsOfGroup(id,0); // change to get all
      setInfo(response);
      setLoading(false);
    }
    async function fetchGroup() {
      setLoading(true);
      const groupResponse = await getOneGroup(id);
      setGroupInfo(groupResponse);
      setLoading(false);

      //booleans
      setShowNavbar(groupResponse?.showNavbar);
      setPublished(groupResponse?.published);
      setPostCover(groupResponse?.postCover);
      setPostDate(groupResponse?.postDate);
      setPostText(groupResponse?.postText);
      setPostTitle(groupResponse?.postTitle);
      setValueTitle(groupResponse?.title);
      setTitle(groupResponse?.title);
      setMetaDescription(groupResponse?.metaDescription);
      setUrl(groupResponse?.url);
      setPostsId(groupResponse?.postsId);
    }
    
    
    fetchNews();
    fetchGroup();
  }, [0,id]);


  const [openQuestionModalDelete, setOpenQuestionModalDelete] = useState(false);

  const [openQuestionModalPatch, setOpenQuestionModalPatch] = useState(false);

  const handleOpenQuestionModalDelete = () => setOpenQuestionModalDelete(!openQuestionModalDelete);
  const handleOpenQuestionModalPatch = () => setOpenQuestionModalPatch(!openQuestionModalPatch);


  const onChangeSwitchPublished = () => setPublished(!published);
  const onChangeSwitchShowNavbar= () => setShowNavbar(!showNavbar); 
  const onChangeSwitchPostCover= () => setPostCover(!postCover);
  const onChangeSwitchPostDate= () => setPostDate(!postDate);
  const onChangeSwitchPostTitle= () => setPostTitle(!postTitle);
  const onChangeSwitchPostText= () => setPostText(!postText);


  


  function removeSpecialCharacters(str: string) {
    return str
      .replace(/[^\w\s]/gi, '') // remove caracteres especiais
      .replace(/\s+/g, ''); // remove espaços
  }


  //
  async function handleSubmitPatch(event: FormEvent) {
    event.preventDefault();
    const formData = new FormData();
    if(!valueTitle){
      setError("Prencha o campo Título");
      setModalError(true);
      return;
    }
    
    let removeSpecialStr = removeSpecialCharacters(valueTitle);
    
    let strUrl = "https://laperme.musica.ufrn.br/" + removeSpecialStr;
    if(!valueMetaDescription){
      setValueMetaDescription(metaDescription);
      return;
    }

    formData.append('title', valueTitle);
    formData.append('metaDescription', valueMetaDescription);
    formData.append('published', Boolean(published).toString());
    formData.append('url', strUrl);
    formData.append('showNavbar', Boolean(showNavbar).toString());
    formData.append('postCover', Boolean(postCover).toString());
    formData.append('postDate', Boolean(postDate).toString());
    formData.append('postText', Boolean(postText).toString());
    formData.append('postTitle', Boolean(postTitle).toString());
    
   

    const response = await updateGroup(id,formData);
    if (response?.Error) {
      setError(response.error);
      setModalError(true);
      router.push('/admin/login');
      return;
    }
    setResponse(response);
    setRedirectionHome(false);
    setModalSuccess(true);
  }













  function handleViewPost() {
       router.push('/admin/groups/edit/'+id+'/postView');
    
  }

  async function handleSubmitDelete(event: FormEvent) {
    event.preventDefault();

    if(postsId.length > 0){
      setModalExistsPosts(true);
    }
    else{
      const response = await deleteGroup(id);
      if (response?.Error) {
        
        setError(response?.Error);
        setModalError(true);
        router.push('/admin/login');
        return;
      }
      setResponse(response);
      setModalSuccess(true);

    }


   
  }


  const redirectToHome = async () => {
    await router.push('/admin/home');
  };
  const redirectToThis = async () => {
    await router.push("/admin/groups/edit/"+ id + "/postView");

  };
  

  if (!fallback) {
    return <h1>Carregando...</h1>;
  }
  
  return (
    <>
      <Head>
        <title>{groupInfo?.title} | Laperme</title>
      </Head>

        <div className={styles.container}>
        <SideBar/>
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
            title="Operação realizada com Sucesso"
            body="Clique em OK para continuar"
            onClick={() => {
              if (RedirectionHome) {
                redirectToHome();
              } else {
                redirectToThis();
              }
            }}
            handleSetModal={setModalSuccess}
          />
        )}
        {modalExistsPosts && (
          <ReactNotificationModal
            isOpen={modalExistsPosts}
            title="Erro"
            body="Não foi possivel apagar o grupo pois existem Posts"
            onClick={() => undefined}
            handleSetModal={setModalExistsPosts}
          />
        )}
        <main>
        <Paper elevation={4} className={styles.paperTop}>
           
            
            
            <TableContainer>
            
              <Table>
                <div className={styles.header}>              
                  <div className={styles.topHead}>
                    <h2>Grupo "{groupInfo?.title}"</h2>
                  </div>
                  <div className={styles.contentButtonDelete}>
                    <Button label="Deletar" handleClick={handleOpenQuestionModalDelete} />
                    <QuestionModal
                      open={openQuestionModalDelete}
                      submit
                      title="Deletar Grupo"
                      body="Você realmente quer deletar o Grupo?"
                      btnLeft="Voltar"
                      btnRight="Deletar e continuar"
                      handleCancelModal={handleOpenQuestionModalDelete}
                      handleSubmit={handleSubmitDelete}
                    />
                  </div>
                </div> 

                <div className={styles.row}>
                  <TextInput 
                    label="Título"
                    name="title"
                    placeholder="Título"
                    type="text"
                    defaultValue={groupInfo?.title}
                    maxLength={100}
                    required
                    onChange={(e) => setValueTitle(e.target.value)}
                  />
                  <TextInput
                    label="Url"
                    placeholder="Url"
                    name="url"
                    type="text"
                    value={"https://laperme.musica.ufrn.br/" + removeSpecialCharacters(valueTitle)}
                    disabled
                  />
                </div>
                
                <div className={styles.row}>
                  <div className={styles.textArea}>
                    <span>Meta Description</span>
                    <textarea
                      name="metaDescription"
                      placeholder="Meta Description"
                      defaultValue={groupInfo?.metaDescription}
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
                  <Button label="Ver Posts" handleClick={handleViewPost} />

                  <Button label="Atualizar" handleClick={handleOpenQuestionModalPatch} />
                  <QuestionModal
                    open={openQuestionModalPatch}
                    submit
                    title="Atualizar Grupo"
                    body="Você realmente quer atualizar o Grupo?"
                    btnLeft="Voltar"
                    btnRight="Atualizar e continuar"
                    handleCancelModal={handleOpenQuestionModalPatch}
                    handleSubmit={handleSubmitPatch}
                  />

                
                </div>

            



              </Table>
            </TableContainer>
          </Paper>

        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const id = ctx.params?.id; 
    
    const { 'nextauth.token': token } = parseCookie(ctx.req);
    const apiClient = getAPIClient(ctx);
    
    const resUnlarced = await apiClient.get('/news/group/'+ id +'/list');
    const response = {data:""};
    response.data = resUnlarced.data.response;


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
        data: response.data,
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
