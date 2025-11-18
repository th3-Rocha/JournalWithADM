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
import { usePagination } from '../../../../../../contexts/usePagination';
import { SideBar } from '../../../../../../components/admin/SideBar';
import { TableToolbar } from '../../../../../../components/admin/Table/TableToolBar';
import { TableHeadContainer } from '../../../../../../components/admin/Table/TableHead';
import { getAllPaginatedNewsOfGroup } from '../../../../../../services/requests/newsRequest';
import { getOneGroup } from '../../../../../../services/requests/groupsRequest';
import styles from '../styles.module.scss';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getAPIClient } from '../../../../../../services/axios';
import { parseCookie } from '../../../../../../utils/cookies';
import { NewsProps } from '../../../../../../types/newsTypes';
import { useRouter } from 'next/router';
import { ActionMenu } from '../../../../../../components/admin/ActionMenu';
import { deleteNews } from '../../../../../../services/requests/newsRequest';
import { getComparator } from '../../../../../../utils/sortComparador';
import { NewsResponseProps } from '../../../../../../types/newsTypes';
import { GroupsResponseProps } from '../../../../../../types/groupsTypes';
import { ReactNotificationModal } from '../../../../../../components/admin/Modal/ResponseModal';


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
  const [response, setResponse] = useState<NewsResponseProps | null>();
  const [error, setError] = useState<string>();

  const [title, setTitle] = useState('');
  const [showNavbar, setshowNavbar] = useState(true);
  const [metaDescription, setMetaDescription] = useState('');
  const [published, setPublished] = useState(true);
  const [url, setUrl] = useState('');

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
      setshowNavbar(groupResponse?.showNavbar);
      setPublished(groupResponse?.published);
      setTitle(groupResponse?.title);
      setMetaDescription(groupResponse?.metaDescription);
      setUrl(groupResponse?.url);

    }
    
    fetchNews();
    fetchGroup();
  }, [0,id]);


  function handleBack() {
    router.push('/admin/groups/edit/'+id);
 
}













 

  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    handleChangePage,
    handleChangeRowsPerPage,
    handleRequestSort,
  } = usePagination();
  let idGroup = id;

  const handleOpenAddNewsPage = () => {
    if (typeof idGroup === 'string') {
      router.push(`/admin/posts/register/?var=${encodeURIComponent(idGroup)}`);
    } else {
      console.error("idGroup is not a valid string.");
    }
  };

  const refreshNewsListingPage = () => router.push('/admin/posts');

  //const handleOpenAddNewsPage = () => router.push('/admin/posts/register');

  const EditPost = () => router.push('/admin/groups/edit/' + id);

  const onClickDeleteNews = async (id: string) => await deleteNews(id);

  const redirectToNewsViewPage = (id: string) =>
    router.push(`/admin/posts/view/${id}`);

  const redirectToHome = async () => {
    await router.push('/admin/home');
  };

  const redirectToEditNewsPage = (id: string) =>
    router.push(`/admin/posts/edit/${id}`);

  if (!fallback) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <Head>
        <title>{groupInfo?.title} | Laperme</title>
      </Head>

        <div className={styles.container}>
          <SideBar />
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
            onClick={redirectToHome}
            handleSetModal={setModalSuccess}
          />
        )}
        <main>

          <Paper elevation={4} className={styles.paper}>
          

            <TableToolbar
              TwoButton= {true}  
              buttonTwoName = "Editar Grupo"
              openAddComponentTwo = {EditPost}
              label={"Posts do Grupo \x22"+ groupInfo?.title + "\x22"}
              count={data?.length}
              buttonName = "Criar um Post"
              openAddComponent={handleOpenAddNewsPage}
            />

            <TableContainer>
              <Table >
                <TableHeadContainer
                  headColumns={headColumns}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  
                />

                <TableBody>
                  {data
                    .slice()
                    .sort(getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow  key={row._id} >
                        <TableCell  height={80} align="left">{row.title}</TableCell>
                        <TableCell className="link" align="left">
                          {row.author}
                        </TableCell>
                        <TableCell align="left">
                          {row.published ? 'Sim' : 'Não'}
                        </TableCell>
                        <TableCell align="left">
                          <ActionMenu
                            id={row._id}
                            viewPage={redirectToNewsViewPage}
                            updatePage={redirectToEditNewsPage}
                            deleteSuccessPath={refreshNewsListingPage}
                            deleteFunction={onClickDeleteNews}
                            shouldShowCopyLink={true}
                            titleForDeleteSuccessModal="Seu Post foi deletado."
                            modalTitle="Deletar Post"
                            modalBody="Você realmente quer deletar o Post?"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
           
            <TablePagination component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[]}>
            </TablePagination>
          
             
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
