import type { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { ChallengeDetailsView } from '@/components/challenges';
import { MainLayout } from '@/components/common/layout';
import { QUERY_PARAM_CALLBACK_URL } from '@/const/queryParams';
import { prisma } from '@/server/db/client';
import type { NextPageWithLayout } from '../_app';

const Challenge: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const challengeId = Array.isArray(id) ? id[0] : id;

  return (
    <>
      <ChallengeDetailsView challengeId={challengeId ?? ''} />
    </>
  );
};

export default Challenge;

Challenge.getLayout = (page) => {
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
