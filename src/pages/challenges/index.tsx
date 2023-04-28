import type { Role } from '@prisma/client';
import type { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import * as React from 'react';
import type { NextPageWithLayout } from '../_app';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { TerraChallengesViewOrgs, TerraChallengesViewPlayers } from '@/components/challenges';
import { MainLayout } from '@/components/common';
import { QUERY_PARAM_CALLBACK_URL } from '@/const/queryParams';

const RoleViews = {
  ADMIN: TerraChallengesViewOrgs,
  PLAYER: TerraChallengesViewPlayers,
  ORGANIZATION: TerraChallengesViewOrgs,
} satisfies { [key in keyof typeof Role]: React.FC };

const Challenges: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const { data: session, status } = useSession();

  // TODO use EmptyView component
  const RoleView = session?.user?.role
    ? RoleViews[session.user.role] ?? TerraChallengesViewOrgs
    : TerraChallengesViewOrgs;

  const isLoading = status === 'loading';

  return (
    <>
      <Head>
        <title>{t('titles.challengesOverview')}</title>
      </Head>

      {isLoading && <div>Loading...</div>}
      {!isLoading && <RoleView />}
    </>
  );
};

export default Challenges;

Challenges.getLayout = (page) => {
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
        ['common', 'navigation', 'challenges'],
        nextI18nConfig,
        ['en'],
      )),
    },
  };
};
