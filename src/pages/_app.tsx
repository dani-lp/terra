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

import { useRouter } from 'next/router';
import '../styles/globals.css';

const TopProgressBar = dynamic(
  () => import('@/components/common/top-progress-bar/TopProgressBar'),
  { ssr: false },
);

/**
 * Redirect users to the landing page if they are not authenticated
 */
const InternalSessionRedirect = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (!session && status === 'unauthenticated') {
      void router.push('/');
    }
  }, [session, status, router]);

  return null;
};

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
      <TopProgressBar />
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
        <InternalSessionRedirect />
      </SessionProvider>
    </>
  );
};

const I18nApp = appWithTranslation(MyApp);
const TRPCApp = trpc.withTRPC(I18nApp);

export default TRPCApp;
