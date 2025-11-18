import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import Pagination from 'react-paginate';
import { ClipLoader } from 'react-spinners';
import { differenceInMinutes } from 'date-fns';

import { IconArrowLeft, IconArrowRight } from '../../components/Icons';
import { Footer } from '../../components/Footer';
import { NavBar } from '../../components/NavBar';
import { DesktopNewsComponent } from '../../components/NewsComponent/Desktop';
import { PLACEHOLDER_IMAGE, PLACEHOLDER_TITLE, PLACEHOLDER_DESCRIPTION } from '../../utils/placeholders';
import { getAllPaginatedNews } from '../../services/requests/newsRequest';
import { getInfoFooter } from '../../services/requests/footerRequest';
import { NewsResponseProps } from '../../types/newsTypes';
import { FooterResponseProps } from '../../types/footerTypes';

import styles from './styles.module.scss';

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

  type NewsPageProps = {
    news: Response;
    footer: FooterResponseProps;
  };

export default function NewsPage({ news, footer }: NewsPageProps) {
  const [page, setPage] = useState(1);
  const [paginatedNews, setPaginatedNews] = useState<Response>(news);
  const [loading, setLoading] = useState(false);

  const handlePageClick = (paginationEvent: any) => {
    setPage(paginationEvent.selected + 1);
  };

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      const paginatedResponse = await getAllPaginatedNews(page);
      setPaginatedNews(paginatedResponse);
      setLoading(false);
    }
    fetchNews();
  }, [page]);

  return (
    <>
      <Head>
        <title>Laperme</title>
      </Head>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Notícias</h1>

          <div className={styles.news}>
            {loading ? (
              <div className={styles.spinner}>
                <ClipLoader
                  size={88}
                  color={'var(--blue-600)'}
                  loading={loading}
                />
              </div>
            ) : (
              paginatedNews?.response?.length > 0 ? (
                paginatedNews.response?.map((newsItem) => (
                  <DesktopNewsComponent
                    key={newsItem?._id || 'news-item-placeholder'}
                    id={newsItem?._id}
                    date={newsItem?.updatedAt}
                    description={newsItem?.text || PLACEHOLDER_DESCRIPTION}
                    showImage={true}
                    showDate={true}
                    title={newsItem?.title || PLACEHOLDER_TITLE}
                    url={newsItem?.url || PLACEHOLDER_IMAGE}
                    alt={newsItem?.altText || PLACEHOLDER_TITLE}
                  />
                ))
              ) : (
                <DesktopNewsComponent
                  key={'placeholder-news'}
                  id={''}
                  date={new Date()}
                  description={PLACEHOLDER_DESCRIPTION}
                  showImage={true}
                  showDate={true}
                  title={PLACEHOLDER_TITLE}
                  url={PLACEHOLDER_IMAGE}
                  alt={PLACEHOLDER_TITLE}
                />
              )
            )}
          </div>
          <Pagination
            className={styles.paginated}
            pageLinkClassName={styles.pageLink}
            pageClassName={styles.page}
            activeLinkClassName={styles.active}
            onPageChange={handlePageClick}
            activeClassName={styles.active}
            pageCount={paginatedNews?.totalPages || 1}
            nextLabel={<IconArrowRight />}
            nextLinkClassName={styles.arrowLink}
            previousLinkClassName={styles.arrowLink}
            previousLabel={<IconArrowLeft />}
            previousClassName={styles.arrow}
            nextClassName={styles.arrow}
          />
        </div>
      </div>
      <Footer footer={footer} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const newsResponse = await getAllPaginatedNews();

  const footerResponse = await getInfoFooter();

  const sortedNews = newsResponse.response.sort(
    (left: NewsResponseProps, right: NewsResponseProps) => {
      return differenceInMinutes(new Date(right.updatedAt), new Date(left.updatedAt));
    }
  );

  return {
    props: {
      news: sortedNews || null,
      footer: footerResponse || null,
    }
  };
};
