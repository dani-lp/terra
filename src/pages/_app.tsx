import { type AppType, type AppProps } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { NextPage } from 'next';
import * as React from 'react';
import { appWithTranslation } from 'next-i18next'

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
    </>
  );

  return (
    <SessionProvider session={session}>
      {layout}
      <ToDevButton />
    </SessionProvider>
  );
};

const I18nApp = appWithTranslation(MyApp);
const TRPCApp = trpc.withTRPC(I18nApp);

export default TRPCApp;
