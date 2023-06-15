import type { Role } from '@prisma/client';
import type { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import * as React from 'react';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { TerraChallengesViewOrgs, TerraChallengesViewPlayers } from '@/components/challenges';
import { MainLayout } from '@/components/common';
import { QUERY_PARAM_CALLBACK_URL } from '@/const/queryParams';
import { prisma } from '@/server/db/client';
import type { NextPageWithLayout } from '../_app';

const RoleViews = {
  ADMIN: React.Fragment,
  PLAYER: TerraChallengesViewPlayers,
  ORGANIZATION: TerraChallengesViewOrgs,
} satisfies { [key in keyof typeof Role]: React.FC };

const Challenges: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const { data: session, status } = useSession();

  // TODO use EmptyView component
  const RoleView = session?.user?.role
    ? RoleViews[session.user.role] ?? React.Fragment
    : React.Fragment;

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

  if (session && session?.user?.role === 'ORGANIZATION') {
    const orgUserDetails = await prisma.userDetails.findUnique({
      where: { userId: session.user?.id },
      select: { id: true },
    });

    const organizationData = await prisma.organizationData.findUnique({
      where: { userDetailsId: orgUserDetails?.id },
      select: { approvalState: true },
    });

    if (organizationData?.approvalState === 'UNSUBMITTED') {
      return {
        redirect: {
          destination: '/organizations/new',
          permanent: false,
        },
      };
    } else if (organizationData?.approvalState !== 'ACCEPTED') {
      return {
        redirect: {
          destination: '/organizations/waiting-room',
          permanent: false,
        },
      };
    } 
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
