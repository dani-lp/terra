import type { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { MainLayout } from '@/components/common/layout';
import { QUERY_PARAM_CALLBACK_URL } from '@/const/queryParams';
import { prisma } from '@/server/db/client';
import type { NextPageWithLayout } from '../_app';

const Drafts: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Head>
        <title>{t('titles.drafts')}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>Drafts placeholder</div>
    </>
  );
};

export default Drafts;

Drafts.getLayout = (page) => {
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
        ['common', 'navigation'],
        nextI18nConfig,
        ['en'],
      )),
    },
  };
};
