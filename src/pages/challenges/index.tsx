import Head from 'next/head';
import type { NextPageWithLayout } from '../_app';
import { MainLayout } from '@/components/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nConfig from '@/../next-i18next.config.mjs';

const Challenges: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Terra - Challenges</title>
      </Head>
      <div>Challenges placeholder</div>
    </>
  )
};

export default Challenges;

Challenges.getLayout = (page) => {
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