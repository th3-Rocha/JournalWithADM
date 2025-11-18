
import { GetServerSideProps,GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { format } from 'date-fns';

import { useEffect, useState } from 'react';
import pt from 'date-fns/locale/pt';
import { IconCalendar } from '../../../components/Icons';
import { NavBar } from '../../../components/NavBar';
import { NewsResponseProps } from '../../../types/newsTypes';
import {
  getAllPaginatedNews,
  getOneNews,
} from '../../../services/requests/newsRequest';
import { getInfoFooter } from '../../../services/requests/footerRequest';
import { FooterResponseProps } from '../../../types/footerTypes';
import { Footer } from '../../../components/Footer';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';

type SeeNewsProps = {
  news: NewsResponseProps;
  footer: FooterResponseProps;
};

export default function SeeNews({ footer, news }: SeeNewsProps) {
  let content;
  if (!news?.published) {
    content = (
      <div className={styles.container}>
      <h3>Loading...</h3>
      <div className={styles.text}>
       
      </div>
      <div className={styles.author}>
      
      </div>
      
    </div>
  );
  } else {
    
    content = (
      <div className={styles.container}>
        <h3>{news?.title}</h3>
        <div className={styles.text}>
          <img src={news?.url} alt={news?.altText}/>
        </div>
        <div className={styles.author}>
          <div>
            <IconCalendar />
            <span>
              {format(new Date(news?.updatedAt), 'dd, MMM yyyy', {
                locale: pt,
              })}
            </span>
          </div>
          <span>{news?.author}</span>
        </div>
        <div
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: news?.text }}
        />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Laperme</title>
        <meta name="description" content={news?.metaDescription} />
      </Head>
      <NavBar />
      {content}
      <Footer footer={footer} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { id } = context.params || {};

    if (!id) {
      return {
        notFound: true,
      };
    }

    const newsResponse = await getOneNews(id as string);

    if (!newsResponse.published) {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      };
    }

    const footerResponse = await getInfoFooter();

    return {
      props: {
        news: newsResponse || null,
        footer: footerResponse || null,
      },
    };
  } catch (error: any) {
    error.ctx = context;
    console.error({ ...error }, error.message || "getServerSideProps: failed at {url}");
    throw error;
  }
};
