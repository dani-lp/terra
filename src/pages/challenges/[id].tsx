import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { ChallengeDetailsView } from '@/components/challenges';
import { MainLayout } from '@/components/common';
import type { NextPageWithLayout } from '../_app';

const Challenge: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
 
  const challengeId = Array.isArray(id) ? id[0] : id;

  return (
    <>
      <Head>
        <title>Challenge</title>
      </Head>
      <ChallengeDetailsView challengeId={challengeId ?? ''} />
    </>
  );
};

export default Challenge;

Challenge.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'navigation'], nextI18nConfig, ['en'])),
  },
});
