import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { ChallengeDetailsView } from '@/components/challenges';
import { MainLayout } from '@/components/common';
import { QUERY_PARAM_CALLBACK_URL } from '@/const/queryParams';
import type { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
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
