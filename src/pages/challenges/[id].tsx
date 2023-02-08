import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { NextPageWithLayout } from '../_app';
import { MainLayout } from '@/components/common';
import nextI18nConfig from '@/../next-i18next.config.mjs';
import { useRouter } from 'next/router';

const Challenge: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Challenge</title>
      </Head> 
      <h1>Challenge placeholder - {id}</h1>
    </>
  );
};

export default Challenge;

Challenge.getLayout = (page) => {
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