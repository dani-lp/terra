import type { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { MainLayout } from '@/components/common';
import { AdminOrgsView, AllOrgsView } from '@/components/organizations';
import { QUERY_PARAM_CALLBACK_URL } from '@/const/queryParams';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/server/db/client';
import type { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import type { NextPageWithLayout } from '../_app';

const views: Record<Role, () => JSX.Element> = {
  ADMIN: AdminOrgsView,
  ORGANIZATION: () => <></>,
  PLAYER: AllOrgsView,
};

const Organizations: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();

  const OrgView = views[session?.user?.role ?? 'ORGANIZATION'];

  return (
    <>
      <Head>
        <title>{t('titles.organizationsOverview')}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OrgView />
    </>
  );
};

export default Organizations;

Organizations.getLayout = (page) => {
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
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: await getServerSession(context.req, context.res, authOptions),
      ...(await serverSideTranslations(
        context.locale ?? '',
        ['common', 'navigation', 'orgs'],
        nextI18nConfig,
        ['en'],
      )),
    },
  };
};
