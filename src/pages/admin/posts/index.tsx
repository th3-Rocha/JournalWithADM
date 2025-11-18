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

import { usePagination } from '../../../contexts/usePagination';
import { SideBar } from '../../../components/admin/SideBar';
import { TableToolbar } from '../../../components/admin/Table/TableToolBar';
import { TableHeadContainer } from '../../../components/admin/Table/TableHead';

import { getOneGroup } from '../../../services/requests/groupsRequest';
import styles from '../admin.module.scss';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getAPIClient } from '../../../services/axios';
import { parseCookie } from '../../../utils/cookies';
import { NewsProps } from '../../../types/newsTypes';
import { useRouter } from 'next/router';
import { ActionMenu } from '../../../components/admin/ActionMenu';
import { deleteNews } from '../../../services/requests/newsRequest';
import { getComparator } from '../../../utils/sortComparador';
import { useEffect, useState } from 'react';
import { string } from 'yup/lib/locale';

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
    id: 'groupId',
    label: 'Grupo',
  },
  {
    id: 'published',
    label: 'Publicado',
  },
  
];



export default function News({ data, fallback }: NewsProps) {
  const router = useRouter();
  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    handleChangePage,
    handleChangeRowsPerPage,
    handleRequestSort,
  } = usePagination();

  const handleOpenAddNewsPage = () => router.push('/admin/posts/register');

  const refreshNewsListingPage = () => router.push('/admin/posts');

  const onClickDeleteNews = async (id: string) => {
    const response = await deleteNews(id);
    // faz algo com a resposta
    
    if(response.Error){
      router.push('/admin/login');
    }
    return response; 
  }

  const redirectToNewsViewPage = (id: string) =>
    router.push(`/admin/posts/view/${id}`);

  const redirectToEditNewsPage = (id: string) =>
    router.push(`/admin/posts/edit/${id}`);

  if (!fallback) {
    return <h1>Carregando...</h1>;
  }

  let groupName = "";
  let [dataNews, setDataNews] = useState(data);
  const [loading, setLoading] = useState(true);







  const fetchGroups = async () => {
    try {
      let menuItens = [
        { name: '', groupId: '' },
      ];
      const response = await fetch(process.env.NEXT_PUBLIC_URL_API_BACKEND + '/postgroups/list');
      if (!response.ok) {
        throw new Error('Não foi possivel listar Grupos: Posts');
      }
      const groupDatas = await response.json();
    
      menuItens = [
      ];
  
      for(let i = 0; i < groupDatas.length; i++){
        let newItem = {name:groupDatas[i].title, groupId:groupDatas[i]._id}
        menuItens.push(newItem);
      }
      for(let i = 0; i < data.length; i++) {
        
        const groupId = data[i].groupId;
        let groupName = menuItens.find(item => item.groupId === groupId)?.name;
        if(typeof groupName === 'string'){
          data[i].groupId = groupName; // transform groupId in to name of Group 
          setDataNews(data);
        }
      }
     
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  
  if(loading) {
    fetchGroups();
    return <span>loading</span> //fazer pagina de loading
  }
  return (
    <>
      <Head>
        <title>Posts | Laperme</title>
      </Head>

      <div className={styles.container}>
        <SideBar />
        <main>
          <Paper elevation={4} className={styles.paper}>
            <TableToolbar
              label="Posts"
              buttonName = "Criar Post"
              count={dataNews?.length}
              openAddComponent={handleOpenAddNewsPage}
            />

            <TableContainer>
              <Table>
                <TableHeadContainer
                  headColumns={headColumns}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />

                <TableBody>
                  {dataNews
                    .slice()
                    .sort(getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      
                      <TableRow key={row._id}>
                        <TableCell align="left">{row.title}</TableCell>
                        <TableCell className="link" align="left">
                          {row.author}
                        </TableCell>
                        <TableCell className="link" align="left">
                        {row.groupId } 
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
                            shouldShowCopyLink = {true}
                            titleForDeleteSuccessModal="Seu post foi deletado."
                            modalTitle="Deletar post"
                            modalBody="Você realmente quer deletar o post?"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={dataNews.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[]}
            />
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
    const { 'nextauth.token': token } = parseCookie(ctx.req);
    const apiClient = getAPIClient(ctx);

    const response = await apiClient.get('/news/list-posts');

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
