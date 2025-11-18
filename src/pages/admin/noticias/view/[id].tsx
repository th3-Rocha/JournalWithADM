import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { NewsResponseProps } from '../../../../types/newsTypes';
import { parseCookie } from '../../../../utils/cookies';
import { getAPIClient } from '../../../../services/axios';
import { SideBar } from '../../../../components/admin/SideBar';
import { Switch } from '../../../../components/admin/Switch';
import { PLACEHOLDER_IMAGE, PLACEHOLDER_TITLE, PLACEHOLDER_DESCRIPTION } from '../../../../utils/placeholders';

import styles from './styles.module.scss';

type ViewPageProps = {
  newsData: NewsResponseProps;
};

export default function ViewPage({ newsData }: ViewPageProps) {
  const router = useRouter();
  const redirectToNewsListPage = async () => {
    await router.push('/admin/noticias');
  };

  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.view}>
        <h2>Detalhes da notícia</h2>

        <div className={styles.content}>
          <div className={styles.column}>
            <div className={styles.textField}>
              <p>ID</p>
              <div>{newsData?._id || '-'}</div>
            </div>
            <div className={styles.textField}>
              <p>Título</p>
              <div>{newsData?.title || PLACEHOLDER_TITLE}</div>
            </div>
            <div className={styles.textField}>
              <p>Autor</p>
              <div>{newsData?.author || '-'}</div>
            </div>
            <div className={styles.published}>
              <p>Publicado:</p>
              <Switch
                valueToChange={newsData?.published}
                onChange={() => newsData?.published}
              />
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.textField} id="altText">
              <p>Texto Alternativo</p>
              <div>{newsData?.altText || PLACEHOLDER_DESCRIPTION}</div>
            </div>
            <div className={styles.textField}>
              <p>Imagem</p>
              <Image
                src={(newsData?.url as any) || PLACEHOLDER_IMAGE}
                className={styles.image}
                priority
                width={100}
                layout="responsive"
                height={70}
                objectFit="cover"
                alt="Imagem Desktop"
                objectPosition="top center"
                placeholder="blur"
                blurDataURL={(newsData?.url as any) || PLACEHOLDER_IMAGE}
              />
            </div>
          </div>
        </div>
        <div className={styles.newsText}>
          <p>Texto da notícia</p>
          <div dangerouslySetInnerHTML={{ __html: newsData.text || PLACEHOLDER_DESCRIPTION }} />
        </div>

        <div>
          <button type="button" onClick={redirectToNewsListPage}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const { 'nextauth.token': token } = parseCookie(ctx.req);
    const { id } = ctx.query;
    const apiClient = getAPIClient(ctx);

    const response = await apiClient.get(`/news/get/${id}`);

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
        newsData: response.data,
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
