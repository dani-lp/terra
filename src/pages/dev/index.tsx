import { MainLayout } from '@/components/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from '../_app';
import Head from 'next/head';

import nextI18nConfig from '@/../next-i18next.config.mjs';

const Dev: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Terra - Dev</title>
      </Head>
      <div>DEV PLACEHOLDER</div>
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