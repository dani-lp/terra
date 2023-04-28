import type { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { MainLayout } from '@/components/common';
import { QUERY_PARAM_CALLBACK_URL } from '@/const/queryParams';
import type { NextPageWithLayout } from './_app';

const About: NextPageWithLayout = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('titles.about')}</title>
      </Head>
      <div>About placeholder</div>
    </>
  );
};

export default About;

About.getLayout = (page) => {
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
        ['common', 'navigation'],
        nextI18nConfig,
        ['en'],
      )),
    },
  };
};
