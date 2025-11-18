import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { useEffect, useState } from 'react';
import Pagination from 'react-paginate';
import { ClipLoader } from 'react-spinners';
import { differenceInMinutes } from 'date-fns';
import { IconArrowLeft, IconArrowRight } from '../../../components/Icons';
import { Footer } from '../../../components/Footer';
import { NavBar } from '../../../components/NavBar';
import { DesktopNewsComponent } from '../../../components/NewsComponent/Desktop';
import { PLACEHOLDER_IMAGE, PLACEHOLDER_TITLE, PLACEHOLDER_DESCRIPTION } from '../../../utils/placeholders';
import { getAllPaginatedNews } from '../../../services/requests/newsRequest';
import { getAllPaginatedNewsOfGroup } from '../../../services/requests/newsRequest';
import { getOneGroup } from '../../../services/requests/groupsRequest';
import { getInfoFooter } from '../../../services/requests/footerRequest';
import { NewsResponseProps } from '../../../types/newsTypes';
import { GroupsResponseProps } from '../../../types/groupsTypes';
import { FooterResponseProps } from '../../../types/footerTypes';

import styles from './styles.module.scss';
import { api } from '../../../services/api';


import { useRouter } from 'next/router';
import React from 'react';
import { getAllPaginatedGroup } from '../../../services/requests/groupsRequest';

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
  group: GroupsResponseProps;
};



export default function NewsPage({ news, footer, group }: NewsPageProps) {
const [page, setPage] = useState(1);
const [paginatedNews, setPaginatedNews] = useState<Response>(news);
const [groupInfo, setGroupInfo] = useState<GroupsResponseProps>(group);
const [loading, setLoading] = useState(false);
const router = useRouter();
const { id } = router.query;

const handlePageClick = (paginationEvent: any) => {
  setPage(paginationEvent.selected + 1);
};

useEffect(() => {
  async function fetchNews() {
    setLoading(true);
    const paginatedResponse = await getAllPaginatedNewsOfGroup(id,page);
    setPaginatedNews(paginatedResponse);
    setLoading(false);
  }
  async function fetchGroup() {
    setLoading(true);
    
    const fetchedGroup = await getOneGroup(id);
    if(fetchedGroup.published){
      setLoading(false);
    }else{
      router.push('/404');
    }
    setGroupInfo(fetchedGroup);
    
  }

  fetchNews();
  fetchGroup();
}, [page,id]);

return (
  <>
    <Head>
      <title>Laperme</title>
    </Head>
    <NavBar />
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{loading ? (<div></div>):(groupInfo?.title || PLACEHOLDER_TITLE)} </h1>

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
                  key={newsItem?._id || 'group-news-placeholder'}
                  id={newsItem?._id}
                  date={newsItem?.updatedAt}
                  description={groupInfo?.postText ? (newsItem?.text || PLACEHOLDER_DESCRIPTION) : PLACEHOLDER_DESCRIPTION}
                  title={groupInfo?.postTitle ? (newsItem?.title || PLACEHOLDER_TITLE) : PLACEHOLDER_TITLE}
                  url={groupInfo?.postCover ? (newsItem?.url || PLACEHOLDER_IMAGE) : PLACEHOLDER_IMAGE}
                  showImage={groupInfo?.postCover}
                  showDate={groupInfo?.postDate}
                  alt={newsItem?.altText || PLACEHOLDER_TITLE}
                />
              ))
            ) : (
              <DesktopNewsComponent
                key={'placeholder-group-news'}
                id={''}
                date={new Date()}
                description={PLACEHOLDER_DESCRIPTION}
                title={PLACEHOLDER_TITLE}
                url={PLACEHOLDER_IMAGE}
                showImage={groupInfo?.postCover}
                showDate={groupInfo?.postDate}
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const newsResponse = await getAllPaginatedNews();
    const footerResponse = await getInfoFooter();

    const sortedNews: NewsResponseProps[] = newsResponse.response.sort(
      (left: NewsResponseProps, right: NewsResponseProps) => {
        return differenceInMinutes(new Date(right.updatedAt), new Date(left.updatedAt));
      }
    );

    const matchedNewsItem = sortedNews.find((news: NewsResponseProps) => news._id === params?.id);

    return {
      props: {
        news: sortedNews || null,
        footer: footerResponse || null,
        newsItem: matchedNewsItem || null,
      },
    };
  } catch (err: any) {
    console.error(err.message || 'Error getting server-side props');
    return {
      props: {
        news: null,
        footer: null,
        newsItem: null,
      },
    };
  }
};
