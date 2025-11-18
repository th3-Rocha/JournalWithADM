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
import { IconLink } from '../../../components/Icons';
import { parseCookie } from '../../../utils/cookies';
import { getAPIClient } from '../../../services/axios';
import { BannerProps } from '../../../types/bannerTypes';
import { getComparator } from '../../../utils/sortComparador';
import { ActionMenu } from '../../../components/admin/ActionMenu';
import { deleteBanner } from '../../../services/requests/bannerRequest';

import styles from '../admin.module.scss';

const headColumns = [
  {
    id: 'title',
    label: 'Título do Banner',
  },
  {
    id: 'link',
    label: 'Link',
  },
  {
    id: 'published',
    label: 'Publicado',
  },
];

export function BannerPage({ data }: BannerProps) {
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

  const handleOpenAddBannerPage = () => {
    router.push('/admin/banner/register'); 
  }
  const redirectToBannerViewPage = (id: string) =>
    router.push(`/admin/banner/view/${id}`);
  const redirectToEditBannerPage = (id: string) =>
    router.push(`/admin/banner/edit/${id}`);
  const refreshBannerListingPage = () => router.push('/admin/banner');
  const onClickDeleteBanner = async (id: string) => await deleteBanner(id);

  const http = /^(http|https):/;

  return (
    <>
      <Head>
        <title>Banner | Laperme</title>
      </Head>

      <div className={styles.container}>
        <SideBar />
        <main>
          <Paper elevation={4} className={styles.paper}>
            <TableToolbar
              label="Banner"
              buttonName= "Adicionar"
              count={data?.length}
              openAddComponent={handleOpenAddBannerPage}
            />
            <TableContainer>
              <Table>
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
                          <TableCell align="left">
                            <Link
                              href={
                                row?.link.match(http)
                                  ? row.link
                                  : `https://${row.link}`
                              }
                            >
                              <a
                                className={styles.link}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <IconLink />
                                {row.link}
                              </a>
                            </Link>
                          </TableCell>
                          <TableCell align="left">
                            {row.published ? 'Sim' : 'Não'}
                          </TableCell>
                          <TableCell align="left">
                            <ActionMenu
                              id={row._id}
                              viewPage={redirectToBannerViewPage}
                              updatePage={redirectToEditBannerPage}
                              deleteSuccessPath={refreshBannerListingPage}
                              deleteFunction={onClickDeleteBanner}
                              shouldShowCopyLink={false}
                              titleForDeleteSuccessModal="Seu banner foi deletado!"
                              modalTitle="Deletar banner"
                              modalBody="Você realmente quer deletar o banner?"
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

export default BannerPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { 'nextauth.token': token } = parseCookie(ctx.req);
    const apiClient = getAPIClient(ctx);

    const response = await apiClient.get('/banner/list');

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
