import { MainLayout } from '@/components/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from '../_app';
import Head from 'next/head';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { Button } from '@/components/common';
import Link from 'next/link';

const Dev: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Terra - Dev</title>
      </Head>
      <div className='w-full h-full p-2 flex flex-col items-start justify-start gap-4'>
        <Link href="/auth/signin">
          <Button>Sign in</Button>
        </Link>
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