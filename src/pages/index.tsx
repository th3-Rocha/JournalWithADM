import { differenceInMinutes } from 'date-fns';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Carousel } from '../components/Carousel';
import { Shortcut } from '../components/Shortcut';
import { Footer } from '../components/Footer';
import { NavBar } from '../components/NavBar';
import { NewsComponent } from '../components/NewsComponent';
import { getAPIClient } from '../services/axios';
import { getAllCTAs } from '../services/requests/ctaRequest';
import { getInfoFooter } from '../services/requests/footerRequest';
import { BannerResponseProps } from '../types/bannerTypes';
import { CTAResponse } from '../types/CTATypes';
import { FooterResponseProps } from '../types/footerTypes';
import { NewsResponseProps } from '../types/newsTypes';

import styles from './index.module.scss';
import { PLACEHOLDER_IMAGE, PLACEHOLDER_TITLE, PLACEHOLDER_DESCRIPTION } from '../utils/placeholders';

type HomeProps = {
  banner: Array<BannerResponseProps>;
  news: Array<NewsResponseProps>;
  CTAs: Array<CTAResponse>;
  footer: FooterResponseProps;
};

export default function Home({ banner, news, CTAs, footer }: HomeProps) {
  return (
    <>
      <Head>
        <title>Laperme - Site Institucional da Escola de Música</title>
      </Head>
      <NavBar />
      <div className={styles.container}>
        <Carousel data={banner && banner.length ? banner : []} />
        <div  className={styles.news}>
          <div className={styles.newsHead}>
            <h2>Notícias</h2>
            <Link href="/noticias">
              <a>Ver Mais</a>
            </Link>
          </div>
          <NewsComponent news={news && news.length ? news : []} />
        </div>
        <div className={styles.cta}>
          {(CTAs && CTAs.length ? CTAs : [{
            _id: 'placeholder-cta',
            title: PLACEHOLDER_TITLE,
            path: '#',
            text: PLACEHOLDER_DESCRIPTION,
            buttonText: 'Ver mais',
            file: { url: PLACEHOLDER_IMAGE },
          } as any]).map((cta) => (
            <Shortcut
              key={cta?._id}
              title={cta?.title || PLACEHOLDER_TITLE}
              path={cta?.path || '#'}
              body={cta?.text || PLACEHOLDER_DESCRIPTION}
              buttonText={cta?.buttonText || 'Ver mais'}
              urlImage={cta?.file?.url || PLACEHOLDER_IMAGE}
            />
          ))}
        </div>
      </div>
      <Footer footer={footer} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const apiClient = getAPIClient();

  try {
    const bannerResponse = await apiClient.get('banner/list');
    const newsResponse = await apiClient.get('news/list-news');
    const ctaResponse = await getAllCTAs();
    const footerResponse = await getInfoFooter();

    const sortedBanner = bannerResponse.data
      .slice()
      .sort((left: BannerResponseProps, right: BannerResponseProps) => {
        return differenceInMinutes(new Date(right.updateAt), new Date(left.updateAt));
      })
      .filter((bannerItem: BannerResponseProps) => {
        return bannerItem.published === true;
      });

    const sortedNews = newsResponse.data
      .slice()
      .sort((left: NewsResponseProps, right: NewsResponseProps) => {
        return differenceInMinutes(
          new Date(right.updatedAt),
          new Date(left.updatedAt)
        );
      })
      .filter((newsItem: NewsResponseProps) => {
        return newsItem.published === true;
      });

    return {
      props: {
        banner: sortedBanner,
        news: sortedNews.slice(0, 4),
        CTAs: ctaResponse,
        footer: footerResponse,
      },
    };
  } catch (error: any) {
    return {
      props: {
        error: null,
      },
    };
  }
};
