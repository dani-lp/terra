import type { NextPage } from 'next';
import { type Session } from 'next-auth';
import { SessionProvider, useSession } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import { type AppProps, type AppType } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import 'nprogress/nprogress.css';
import * as React from 'react';

import { ToDevButton } from '@/components/dev';
import { trpc } from '../utils/trpc';

import '../styles/globals.css';

const TopProgressBar = dynamic(
  () => import('@/components/common/top-progress-bar/TopProgressBar'),
  { ssr: false },
);

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactElement;
};
type MyAppProps = AppProps & {
  Component: NextPageWithLayout;
  pageProps: { session: Session | null };
};

const Layout = ({ Component, pageProps }: MyAppProps) => {
  const { status } = useSession();

  const getLayout = Component.getLayout ?? ((page) => page);

  const layout =
    status === 'authenticated' ? (
      getLayout(
        <>
          <TopProgressBar />
          <Component {...pageProps} />
        </>,
      )
    ) : (
      <>
        <TopProgressBar />
        <Component {...pageProps} />
      </>
    );

  return layout;
};
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: MyAppProps) => {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <SessionProvider session={session} refetchOnWindowFocus>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <Layout Component={Component} pageProps={pageProps} />
        {process.env.NODE_ENV === 'development' && <ToDevButton />}
      </SessionProvider>
    </>
  );
};

const I18nApp = appWithTranslation(MyApp);
const TRPCApp = trpc.withTRPC(I18nApp);

export default TRPCApp;
