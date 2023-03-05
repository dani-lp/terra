import * as React from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { NextPageWithLayout } from '../_app';
import { MainLayout } from '@/components/common';
import nextI18nConfig from '@/../next-i18next.config.mjs';
import { TerraChallengesView } from '@/components/challenges';
import { useSession } from 'next-auth/react';
import type { Role } from '@prisma/client';


const RoleViews = {
  ADMIN: TerraChallengesView,
  PLAYER: TerraChallengesView,
  ORGANIZATION: TerraChallengesView,
} satisfies { [key in keyof typeof Role]: React.FC };

// TEMP
const Challenges: NextPageWithLayout = () => {
  const { data: session } = useSession();

  // TODO use EmptyView component
  const RoleView = session?.user?.role
    ? RoleViews[session.user.role] ?? TerraChallengesView
    : TerraChallengesView;

  return (
    <>
      <Head>
        <title>Challenges - Terra</title>
      </Head>

      <RoleView />
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
      ['common', 'navigation', 'challenges',],
      nextI18nConfig,
      ['en']
    )),
  },
});
