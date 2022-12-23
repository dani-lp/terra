import { MainLayout } from '@/components/common';
import type { NextPageWithLayout } from '../_app';
import Head from 'next/head';

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