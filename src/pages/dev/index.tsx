import * as React from 'react';
import { InputField, MainLayout } from '@/components/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from '../_app';
import Head from 'next/head';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { Button } from '@/components/common';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Dev: NextPageWithLayout = () => {
  const [queryParamValue, setQueryParamValue] = React.useState<string>('');
  const router = useRouter();

  const QUERY_PARAM_TEST = 'test';

  const handleQueryParamChange = () => {
    // NOTE prevents adding a new URL into the history stack
    if (queryParamValue.length === 0) {
      // temporary fix, doesn't work with 1+ query params 
      router.replace(router.pathname);
      return;
    }
    router.push({
      query: {
        ...router.query,
        [QUERY_PARAM_TEST]: queryParamValue,
      },
    });
  };

  const clearQueryParams = () => {
    router.replace(router.pathname);
  };

  return (
    <>
      <Head>
        <title>Terra - Dev</title>
      </Head>
      <div className='mb-4 flex h-full w-full flex-col items-start justify-start gap-4 p-2'>
        <Link href="/auth/signin">
          <Button>Sign in</Button>
        </Link>
        <div>
          <InputField
            value={queryParamValue}
            onChange={(e) => setQueryParamValue(e.target.value)}
            className="mb-2"
          />
          <div className="flex items-center justify-center gap-2">
            <Button onClick={handleQueryParamChange}>
              Set query params
            </Button>
            <Button variant="inverse" onClick={clearQueryParams}>
              Clear query params 
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dev;

Dev.getLayout = (page) => {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ['common', 'navigation'],
      nextI18nConfig,
      ['en']
    )),
  },
});