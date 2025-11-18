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

import styles from '../admin.module.scss';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getAPIClient } from '../../../services/axios';
import { parseCookie } from '../../../utils/cookies';
import { NewsProps } from '../../../types/newsTypes';
import { useRouter } from 'next/router';
import { ActionMenu } from '../../../components/admin/ActionMenu';
import { deleteNews } from '../../../services/requests/newsRequest';
import { getComparator } from '../../../utils/sortComparador';

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

  const handleOpenAddNewsPage = () => router.push('/admin/noticias/register');

  const refreshNewsListingPage = () => router.push('/admin/noticias');

  const onClickDeleteNews = async (id: string) => await deleteNews(id);

  const redirectToNewsViewPage = (id: string) =>
    router.push(`/admin/noticias/view/${id}`);

  const redirectToEditNewsPage = (id: string) =>
    router.push(`/admin/noticias/edit/${id}`);

  if (!fallback) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <Head>
        <title>Notícias | Laperme</title>
      </Head>

      <div className={styles.container}>
        <SideBar />
        <main>
          <Paper elevation={4} className={styles.paper}>
            <TableToolbar
              label="Noticias"
              count={data?.length}
              buttonName = "Criar Notícia"
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
                  {data
                    .slice()
                    .sort(getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row._id}>
                        <TableCell align="left">{row.title}</TableCell>
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
                            shouldShowCopyLink = {true}
                            titleForDeleteSuccessModal="Sua notícia foi deletada."
                            modalTitle="Deletar notícia"
                            modalBody="Você realmente quer deletar a notícia?"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={data.length}
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

    const response = await apiClient.get('/news/list-news');

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
