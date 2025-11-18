import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { parseCookie } from '../../../utils/cookies';
import { SideBar } from '../../../components/admin/SideBar';
import { useState } from 'react';
import styles from '../admin.module.scss';



function test(token: string){

  return token;
}


export default function AdminHome() {
  
  let [IsToken, setIsToken] = useState(true);
  let avr = true
  return (
    <>
      <Head>
        <title>Home | Laperme</title>
      </Head>
      <div className={styles.container}>
        <SideBar />
      </div>
      
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { 'nextauth.token': token } = parseCookie(ctx.req);


  if (!token) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

