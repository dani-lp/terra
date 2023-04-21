import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { MainLayout } from '@/components/common';
import { AllOrgsView } from '@/components/organizations';
import { QUERY_PARAM_CALLBACK_URL } from '@/const/queryParams';
import type { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import type { NextPageWithLayout } from '../_app';

const Organizations: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Organizations - Terra</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AllOrgsView />
    </>
  );
};

export default Organizations;

Organizations.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin?${QUERY_PARAM_CALLBACK_URL}=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale ?? '',
        ['common', 'navigation', 'orgs'],
        nextI18nConfig,
        ['en'],
      )),
    },
  };
};
