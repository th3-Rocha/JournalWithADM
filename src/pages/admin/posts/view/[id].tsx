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
  postData: NewsResponseProps;
};

export default function ViewPage({ postData }: ViewPageProps) {
  const router = useRouter();
  const redirectToNewsListPage = async () => {
    await router.push('/admin/posts');
  };

  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.view}>
        <h2>Detalhes do Post</h2>

        <div className={styles.content}>
          <div className={styles.column}>
            <div className={styles.textField}>
              <p>ID</p>
              <div>{postData?._id || '-'}</div>
            </div>
            <div className={styles.textField}>
              <p>Título</p>
              <div>{postData?.title || PLACEHOLDER_TITLE}</div>
            </div>
            <div className={styles.textField}>
              <p>Autor</p>
              <div>{postData?.author || '-'}</div>
            </div>
            <div className={styles.published}>
              <p>Publicado:</p>
              <Switch
                valueToChange={postData?.published}
                onChange={() => postData?.published}
              />
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.textField} id="altText">
              <p>Texto Alternativo</p>
              <div>{postData?.altText || PLACEHOLDER_DESCRIPTION}</div>
            </div>
            <div className={styles.textField}>
              <p>Imagem</p>
              <Image
                src={(postData?.url as any) || PLACEHOLDER_IMAGE}
                className={styles.image}
                priority
                width={100}
                layout="responsive"
                height={70}
                objectFit="cover"
                alt="Imagem Desktop"
                objectPosition="top center"
                placeholder="blur"
                blurDataURL={(postData?.url as any) || PLACEHOLDER_IMAGE}
              />
            </div>
          </div>
        </div>
        <div className={styles.newsText}>
          <p>Texto do Post</p>
          <div dangerouslySetInnerHTML={{ __html: postData.text || PLACEHOLDER_DESCRIPTION }} />
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
        postData: response.data,
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
