import type { AppProps } from 'next/app';
import React from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { AuthProvider } from '../contexts/AuthContext';
import { PaginationProvider } from '../contexts/usePagination';

import '../styles/global.scss';

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <>
      <ToastContainer autoClose={4000} />
      <Head>
        <meta
          content="minimum-scale=1, initial-scale=1, width=device-width"
          name="viewport"
        />
      </Head>

      <PaginationProvider>
        <AuthProvider>
          <Component {...pageProps} suppressHydrationWarning={true} />
        </AuthProvider>
      </PaginationProvider>      
    </>
  );
}
