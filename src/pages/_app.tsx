import { type AppType, type AppProps } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';
import { appWithTranslation } from 'next-i18next';

import { ToDevButton } from '@/components/dev';
import { trpc } from '../utils/trpc';

import '../styles/globals.css';

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactElement;
};

type MyAppProps = AppProps & {
  Component: NextPageWithLayout;
  pageProps: { session: Session | null };
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: MyAppProps) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  const layout = getLayout(
    <>
      <Component {...pageProps} />
    </>,
  );

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <SessionProvider session={session} refetchOnWindowFocus>
        {layout}
        {process.env.NODE_ENV === 'development' && <ToDevButton />}
      </SessionProvider>
    </>
  );
};

const I18nApp = appWithTranslation(MyApp);
const TRPCApp = trpc.withTRPC(I18nApp);

export default TRPCApp;
