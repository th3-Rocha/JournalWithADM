import Link from 'next/link';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from '@material-ui/core';

import { usePagination } from '../../../contexts/usePagination';
import { SideBar } from '../../../components/admin/SideBar';
import { TableHeadContainer } from '../../../components/admin/Table/TableHead';
import { TableToolbar } from '../../../components/admin/Table/TableToolBar';
import { parseCookie } from '../../../utils/cookies';
import { getAPIClient } from '../../../services/axios';
import { getComparator } from '../../../utils/sortComparador';
import { ActionMenu } from '../../../components/admin/ActionMenu';
import { deleteCTA } from '../../../services/requests/ctaRequest';
import { CTAProps } from '../../../types/CTATypes';
import { IconLink } from '../../../components/Icons';

import styles from '../admin.module.scss';
import myStyles from './styles.module.scss';

const headColumns = [
  {
    id: 'title',
    label: 'Título',
  },
  {
    id: 'description',
    label: 'Descrição',
  },
  {
    id: 'link',
    label: 'Link',
  },
];

const http = /^(http|https):/;

export default function CTAPage({ data }: CTAProps) {
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

  const handleOpenAddCTA = () => router.push('/admin/cta/register');
  const redirectToCTAViewPage = (id: string) =>
    router.push(`/admin/cta/view/${id}`);
  const redirectToEditCTAPage = (id: string) =>
    router.push(`/admin/cta/edit/${id}`);
  const refreshCTAListingPage = () => router.push('/admin/cta');
  const onClickDeleteCTA = async (id: string) => await deleteCTA(id);

  return (
    <>
      <Head>
        <title>CTAs | Laperme</title>
      </Head>

      <div className={styles.container}>
        <SideBar />
        <main>
          <Paper elevation={4} className={styles.paper}>
            <TableToolbar
              label="CTAs"
              buttonName='Adicionar'
              count={data?.length}
              openAddComponent={handleOpenAddCTA}
            />
            <TableContainer>
              <Table className={myStyles.table}>
                <TableHeadContainer
                  onRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  headColumns={headColumns}
                />
                <TableBody>
                  {data &&
                    data
                      .slice()
                      .sort(getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <TableRow key={row._id}>
                          <TableCell align="left">{row.title}</TableCell>
                          <TableCell
                            className={myStyles.description}
                            align="left"
                          >
                            {row.text}
                          </TableCell>
                          <TableCell align="left">
                            <Link
                              href={
                                row?.path.match(http)
                                  ? row.path
                                  : `https://${row.path}`
                              }
                            >
                              <a
                                className={styles.link}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <IconLink />
                                {row.path}
                              </a>
                            </Link>
                          </TableCell>
                          <TableCell align="left">
                            <ActionMenu
                              id={row._id}
                              viewPage={redirectToCTAViewPage}
                              updatePage={redirectToEditCTAPage}
                              deleteSuccessPath={refreshCTAListingPage}
                              deleteFunction={onClickDeleteCTA}
                              shouldShowCopyLink={false}
                              titleForDeleteSuccessModal="Seu CTA foi deletado!"
                              modalTitle="Deletar CTA"
                              modalBody="Você realmente quer deletar o CTA?"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={data?.length}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { 'nextauth.token': token } = parseCookie(ctx.req);
    const apiClient = getAPIClient(ctx);

    const response = await apiClient.get('/cta/list');

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
        data: response?.data || null,
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
