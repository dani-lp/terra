import * as React from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { NextPageWithLayout } from '../_app';
import { Button, MainLayout } from '@/components/common';
import { SearchBar } from '@/components/common/form/SearchBar';
import nextI18nConfig from '@/../next-i18next.config.mjs';
import { ChallengeCard, type Challenge, ChallengesFilterGroup } from '@/components/challenges';

// TEMP
const challenges: Challenge[] = [
  { id: 1, name: 'Challenge 1', players: 256, date: '2021-01-01', status: 'open' },
  { id: 2, name: 'Another challenge', players: 2, date: '2021-08-02', status: 'ended' },
  { id: 3, name: 'Some challenge with a way longer name to test adaptation', players: 5918270, date: '2022-08-02', status: 'open' },
  { id: 4, name: 'A short one', players: 270, date: '2022-08-02', status: 'open' },
];

const Challenges: NextPageWithLayout = () => {
  const [search, setSearch] = React.useState<string>('');

  return (
    <>
      <Head>
        <title>Terra - Challenges</title>
      </Head>

      {/* Top bar */}
      <div className="sticky top-0 z-10 hidden h-16 w-full justify-center bg-white px-4 shadow xl:flex">
        <div className="flex h-full w-full max-w-6xl items-center justify-between">
          <h1 className="text-2xl font-bold">Your challenges</h1>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            placeholder="Search your challenges..." // TODO i18n
            className="mb-0 max-w-2xl"
          />
          <Button size='sm'>New</Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col xl:flex-row xl:gap-4 xl:pt-4">
            <div className="min-w-[300px] px-4 py-2 xl:px-0">
              <div className="mb-3 flex flex-row items-center justify-between gap-2 xl:hidden xl:flex-col xl:items-start">
                <h1 className="text-2xl font-bold">Your challenges</h1>
                <Button size='sm' className="xl:w-full">New</Button>
              </div>
              <div className="mb-2 flex items-center justify-between xl:hidden">
                <SearchBar
                  value={search}
                  onChange={(e) => setSearch(e.currentTarget.value)}
                  placeholder="Search your challenges..." // TODO i18n
                  className="mb-0"
                  withButton
                  buttonText="Filters"
                />
              </div>
              <div className="hidden xl:block">
                <ChallengesFilterGroup />
              </div>
            </div>
            <ul role="list" className="grid grid-cols-1 gap-6 py-2 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:px-0">
              {challenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
            </ul>
          </div>
        </div>
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