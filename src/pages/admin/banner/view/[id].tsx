import React from 'react';
import Image from 'next/image';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { BannerResponseProps } from '../../../../types/bannerTypes';
import { Switch } from '../../../../components/admin/Switch';
import { parseCookie } from '../../../../utils/cookies';
import { getAPIClient } from '../../../../services/axios';
import { SideBar } from '../../../../components/admin/SideBar';
import { NextLink } from '../../../../components/admin/NextLink';

import styles from './styles.module.scss';

type ViewPageProps = {
  data: BannerResponseProps;
};

export default function ViewPage({ data }: ViewPageProps) {
  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.view}>
        <h2>Detalhes do Banner</h2>
        <div className={styles.row}>
          <div className={styles.textField}>
            <p>ID</p>
            <div>{data?._id}</div>
          </div>
          <div className={styles.textField}>
            <p>Link</p>
            <div>{data?.link}</div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.textField}>
            <p>Título</p>
            <div>{data?.title}</div>
          </div>
          <div className={styles.published}>
            <p>Publicado:</p>
            <Switch
              valueToChange={data?.published}
              onChange={() => data?.published}
            />
          </div>
        </div>

        <div className={styles.textField} id="altText">
          <p>Texto Alternativo</p>
          <div>{data?.altText}</div>
        </div>

        <div className={styles.images}>
          <div className={styles.textField}>
            <p>Imagem Desktop</p>
            <Image
              src={data?.desktopImage.url as any}
              priority
              width={100}
              layout="responsive"
              height={75}
              objectFit="cover"
              alt="Imagem Desktop"
              objectPosition="top center"
              placeholder="blur"
              blurDataURL={data?.desktopImage.url}
            />
          </div>
          <div className={styles.textField} id="images">
            <p>Imagem Mobile</p>
            <Image
              src={data?.mobileImage.url as any}
              priority
              width={100}
              layout="responsive"
              height={75}
              objectFit="cover"
              alt="Imagem Mobile"
              objectPosition="top center"
              placeholder="blur"
              blurDataURL={data?.mobileImage.url}
            />
          </div>
        </div>

        <div className={styles.links}>
          <NextLink url="/admin/banner" />
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

    const response = await apiClient.get(`/banner/get/${id}`);

    if (!token) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }

    return {
      props: { data: response.data, fallback: true },
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
