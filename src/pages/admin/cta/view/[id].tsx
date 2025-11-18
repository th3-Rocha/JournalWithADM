import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { NextLink } from '../../../../components/admin/NextLink';
import { SideBar } from '../../../../components/admin/SideBar';
import { getAPIClient } from '../../../../services/axios';
import { CTAResponse } from '../../../../types/CTATypes';
import { parseCookie } from '../../../../utils/cookies';

import styles from './styles.module.scss';

interface ViewCTA {
  data: CTAResponse;
  error: string;
}

export default function ViewCTA({ data }: ViewCTA) {
  return (
    <>
      <Head>
        <title>CTA | Admin</title>
      </Head>

      <div className={styles.container}>
        <SideBar />

        <main>
          <div className={styles.content}>
            <h2>Detalhes do CTA</h2>

            <div className={styles.row}>
              <div className={styles.info}>
                <span>Título</span>
                <p className={styles.text}>{data?.title}</p>
              </div>
              <div className={styles.info}>
                <span>Texto do botão</span>
                <p className={styles.text}>{data?.buttonText}</p>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.info}>
                <span>Texto alternativo</span>
                <p className={styles.text}>{data?.file.altText}</p>
              </div>
              <div className={styles.info}>
                <span>Link do botão</span>
                <p className={styles.text}>/{data?.path}</p>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.info}>
                <span>Imagem</span>
                <Image
                  className={styles.image}
                  src={data?.file.url as any}
                  priority
                  width={100}
                  layout="responsive"
                  height={64}
                  objectFit="cover"
                  alt={data?.file?.altText}
                  objectPosition="top center"
                  placeholder="blur"
                  blurDataURL={data?.file?.url}
                />
              </div>
              <div className={styles.info}>
                <span>Testo de descrição</span>
                <p className={styles.textDescription}>{data?.text}</p>
              </div>
            </div>

            <div className={styles.links}>
              <NextLink url="/admin/cta" />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const apiClient = getAPIClient(ctx);

    const { 'nextauth.token': token } = parseCookie(ctx.req);
    const { id } = ctx.query;

    const response = await apiClient.get<CTAResponse>(`/cta/get/${id}`);

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
