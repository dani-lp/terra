import * as React from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { NextPageWithLayout } from '../_app';
import { Button, MainLayout } from '@/components/common';
import { SearchBar } from '@/components/common/form/SearchBar';
import nextI18nConfig from '@/../next-i18next.config.mjs';

const Challenges: NextPageWithLayout = () => {
  const [search, setSearch] = React.useState<string>('');

  return (
    <>
      <Head>
        <title>Terra - Challenges</title>
      </Head>
      <div className="mb-1 flex items-center justify-between px-4 py-2">
        <h1 className="text-2xl font-bold">Your challenges</h1>
        <Button size='sm'>New</Button>
      </div>
      <div className="flex items-center justify-between px-4">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder="Search your challenges..." // TODO i18n
          className="mb-0"
          withButton
          buttonText="Filters"
        />
      </div>
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